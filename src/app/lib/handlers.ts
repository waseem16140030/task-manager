import { getServerTaskStore, getServerUserStore } from "@/app/lib/stores";
import {
  GetTasksQuery,
  GetTasksQueryVariables,
  GetUsersQuery,
  GetUsersQueryVariables,
  Task,
  TaskInput,
  TaskStatus,
  User,
  UserConfig,
} from "@/graphql/generated/graphql";


export const verifyUserCredentials = async (
  email: string,
  password: string
): Promise<User | null> => {
  const store = getServerUserStore();
  return (
    store
      .getUsers()
      .find((u) => u.email === email && u.password === password) ?? null
  );
};

export const generateJWT = (user: User): string => {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(
    JSON.stringify({
      sub: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 86400, // 24h
    })
  );
  return `${header}.${payload}.${btoa("mock-signature")}`;
};

export const createUser = async (user: User): Promise<User> => {
  const { password, registrationDate, ...restUser } = user;
  const { addUser } = getServerUserStore();
  addUser({
    ...restUser,
    password: password ?? "password@123",
    registrationDate: registrationDate ?? Date.now().toString(),
  });
  return user;
};

export const getUsersConfig = async (): Promise<UserConfig[]> => {
  const { getUsers } = getServerUserStore();
  const activeUsers: UserConfig[] = getUsers()
    .filter((u) => u.status === "active")
    .map(({ id, name }) => ({ id, name }));

  return activeUsers;
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const { getUsers } = getServerUserStore();
  return getUsers().find((u) => u.email === email) ?? null;
};

export const deleteUser = async (id: string): Promise<boolean> => {
  const { getUsers, removeUserById } = getServerUserStore();
  const exists = getUsers().some((u) => u.id === id);

  if (!exists) {
    return false;
  }

  removeUserById(id);
  return true;
};

export const editUserById = async (
  id: string,
  updates: Partial<User>
): Promise<User | null> => {
  const { getUsers, updateUserById } = getServerUserStore();
  const existingUser = getUsers().find((u) => u.id === id);

  if (!existingUser) {
    return null;
  }

  // apply updates
  updateUserById(id, updates);

  // return updated user without password
  const updatedUser = { ...existingUser, ...updates };
  const { password, ...safeUser } = updatedUser;
  return safeUser;
};

export const getUsersList = async (
  variables: GetUsersQueryVariables
): Promise<GetUsersQuery["users"]> => {
  const { getUsers } = getServerUserStore();
  let users = getUsers();

  // 1. Apply filters
  const { role, email, status } = variables?.filters ?? {};
  if (role) users = users.filter((u) => u.role === role);
  if (email)
    users = users.filter((u) =>
      u.email.toLowerCase().includes(email.toLowerCase())
    );
  if (status) users = users.filter((u) => u.status === status);

  if (users.length === 0) {
    return {
      data: [],
      metadata: {
        total: 0,
        page: 1,
        pageSize: variables.pagination?.pageSize ?? 10,
      },
    };
  }

  // 2. Apply sorting
  if (variables?.sort?.field && variables?.sort?.order) {
    const { field, order } = variables.sort;
    const direction = order.toLowerCase() === "asc" ? 1 : -1;

    users = [...users].sort((a, b) => {
      const aVal = a[field as keyof User];
      const bVal = b[field as keyof User];

      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return -direction;
      if (bVal == null) return direction;

      if (typeof aVal === "string" && typeof bVal === "string") {
        return direction * aVal.localeCompare(bVal);
      }
      if (typeof aVal === "number" && typeof bVal === "number") {
        return direction * (aVal - bVal);
      }

      const aDate = new Date(aVal as string | number | Date);
      const bDate = new Date(bVal as string | number | Date);
      if (!isNaN(aDate.getTime()) && !isNaN(bDate.getTime())) {
        return direction * (aDate.getTime() - bDate.getTime());
      }

      return direction * String(aVal).localeCompare(String(bVal));
    });
  }

  // 3. Apply pagination
  const total = users.length;
  const page = variables?.pagination?.page ?? 1;
  const pageSize = variables?.pagination?.pageSize ?? 10;
  const start = (page - 1) * pageSize;
  const paginated = users.slice(start, start + pageSize);

  const sanitizedUsers = paginated.map(({ password, ...rest }) => rest);

  return {
    data: sanitizedUsers,
    metadata: {
      total,
      page,
      pageSize,
    },
  };
};

export const createTask = async (task: TaskInput): Promise<Task> => {
  const { addTask } = getServerTaskStore();
  const newTask: Task = {
    ...task,
    id: `task-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: TaskStatus.Backlog,
  };
  addTask(newTask);
  return newTask;
};

export const getTasksList = async (
  variables: GetTasksQueryVariables
): Promise<GetTasksQuery["tasks"]> => {
  const { getTasks } = getServerTaskStore();
  let tasks: Task[] = getTasks();

  // Filters
  const status = variables?.filters?.status;
  const searchRaw = variables?.filters?.search;
  const search = searchRaw?.trim().toLowerCase();

  if (status) {
    tasks = tasks.filter((t) => t.status === status);
  }

  if (search) {
    tasks = tasks.filter((t) => {
      const title = (t.title ?? "").toLowerCase();
      const desc = (t.description ?? "").toLowerCase();
      return title.includes(search) || desc.includes(search);
    });
  }

  // Pagination
  const total = tasks.length;
  const page = variables?.pagination?.page ?? 1;
  const pageSize = variables?.pagination?.pageSize ?? 10;
  const start = Math.max(0, (page - 1) * pageSize);
  const paginated = tasks.slice(start, start + pageSize);

  return {
    data: paginated,
    metadata: {
      total,
      page,
      pageSize,
    },
  };
};

export const updateTask = async (
  id: string,
  updates: Partial<Task>
): Promise<Task | null> => {
  const { getTasks, updateTaskById } = getServerTaskStore();
  const existing = getTasks().find((t) => t.id === id);
  if (!existing) return null;

  updateTaskById(id, updates);
  return { ...existing, ...updates };
};

export const deleteTask = async (id: string): Promise<boolean> => {
  const { getTasks, removeTaskById } = getServerTaskStore();
  const exists = getTasks().some((t) => t.id === id);
  if (!exists) return false;

  removeTaskById(id);
  return true;
};
