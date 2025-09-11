import { useUserStore } from "@/app/lib/stores";
import {
  GetUsersQuery,
  GetUsersQueryVariables,
  User,
} from "@/graphql/generated/graphql";

export const verifyUserCredentials = async (
  email: string,
  password: string
): Promise<User | null> => {
  const { getUsers } = useUserStore.getState();
  return (
    getUsers().find((u) => u.email === email && u.password === password) ?? null
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
  const { addUser } = useUserStore.getState();
  addUser({
    ...restUser,
    password: password ?? "password@123",
    registrationDate: registrationDate ?? Date.now().toString(),
  });
  return user;
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const { getUsers } = useUserStore.getState();
  return getUsers().find((u) => u.email === email) ?? null;
};

export const deleteUser = async (id: string): Promise<boolean> => {
  const { getUsers, removeUserById } = useUserStore.getState();
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
  const { getUsers, updateUserById } = useUserStore.getState();
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
  const { getUsers } = useUserStore.getState();
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
