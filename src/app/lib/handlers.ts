'use server'
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
} from '@/graphql/generated/graphql'

import { db } from '@/app/lib/db'
import { pusherServer } from '.'

// Login Handler
export const verifyUserCredentials = async (
  email: string,
  password: string,
): Promise<User | null> => {
  const users = await db.getUsers()
  return users.find((u) => u.email === email && u.password === password) ?? null
}

export const generateJWT = async (user: User): Promise<string> => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const payload = btoa(
    JSON.stringify({
      sub: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 86400,
    }),
  )
  return `${header}.${payload}.${btoa('mock-signature')}`
}

// Create User Handler
export const createUser = async (user: User): Promise<User> => {
  const users = await db.getUsers()
  const newUser: User = {
    ...user,
    password: user.password ?? 'password@123',
    registrationDate: user.registrationDate ?? new Date().toISOString(),
  }

  users.push(newUser)
  await db.setUsers(users)
  return newUser
}

// Get Active Users Handler
export const getUsersConfig = async (): Promise<UserConfig[]> => {
  const users = await db.getUsers()
  return users
    .filter((u) => u.status === 'active' && u.role !== 'superAdmin')
    .map(({ id, name }) => ({ id, name }))
}

// Get user by email Handler
export const findUserByEmail = async (email: string): Promise<User | null> => {
  const users = await db.getUsers()
  return users.find((u) => u.email === email) ?? null
}

// Delete user Handler
export const deleteUser = async (id: string): Promise<boolean> => {
  const users = await db.getUsers()
  const idx = users.findIndex((u) => u.id === id)
  if (idx === -1) return false

  users.splice(idx, 1)
  await db.setUsers(users)
  return true
}

// Edit user Handler
export const editUserById = async (id: string, updates: Partial<User>): Promise<User | null> => {
  const users = await db.getUsers()
  const user = users.find((u) => u.id === id)
  if (!user) return null

  Object.assign(user, updates)
  await db.setUsers(users)

  const { password, ...safeUser } = user
  return safeUser
}

// Get users List Handler
export const getUsersList = async (
  variables: GetUsersQueryVariables,
): Promise<GetUsersQuery['users']> => {
  let users = (await db.getUsers()).filter((u) => u.role !== 'superAdmin')

  // 1. Filters
  const { role, email, status } = variables?.filters ?? {}
  if (role) users = users.filter((u) => u.role === role)
  if (email) users = users.filter((u) => u.email.toLowerCase().includes(email.toLowerCase()))
  if (status) users = users.filter((u) => u.status === status)

  // 2. Sorting
  if (variables?.sort?.field && variables?.sort?.order) {
    const { field, order } = variables.sort
    const direction = order.toLowerCase() === 'asc' ? 1 : -1

    users = [...users].sort((a, b) => {
      const aVal = a[field as keyof User]
      const bVal = b[field as keyof User]

      if (aVal == null && bVal == null) return 0
      if (aVal == null) return -direction
      if (bVal == null) return direction

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return direction * aVal.localeCompare(bVal)
      }
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return direction * (aVal - bVal)
      }

      const aDate = new Date(aVal as string | number | Date)
      const bDate = new Date(bVal as string | number | Date)
      if (!isNaN(aDate.getTime()) && !isNaN(bDate.getTime())) {
        return direction * (aDate.getTime() - bDate.getTime())
      }

      return direction * String(aVal).localeCompare(String(bVal))
    })
  }

  // 3. Pagination
  const total = users.length
  const page = variables?.pagination?.page ?? 1
  const pageSize = variables?.pagination?.pageSize ?? 10
  const start = (page - 1) * pageSize
  const paginated = users.slice(start, start + pageSize)

  const sanitizedUsers = paginated.map(({ password, ...rest }) => rest)

  return {
    data: sanitizedUsers,
    metadata: {
      total,
      page,
      pageSize,
    },
  }
}

// Create Task Handler
export const createTask = async (task: TaskInput): Promise<Task> => {
  const tasks = await db.getTasks()
  const newTask: Task = {
    ...task,
    id: `task-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: TaskStatus.Backlog,
  }

  tasks.push(newTask)
  await db.setTasks(tasks)

  if (newTask.assigneeId) {
    await pusherServer.trigger(`user-${newTask.assigneeId}`, 'task-assigned', {
      id: newTask.id,
      title: newTask.title,
      description: newTask.description,
      status: newTask.status,
      assigneeId: newTask.assigneeId,
      createdAt: newTask.createdAt,
    })
  }

  return newTask
}

export const getTasksList = async (
  variables: GetTasksQueryVariables,
): Promise<GetTasksQuery['tasks']> => {
  let tasks = await db.getTasks()
  const users = await db.getUsers()

  // Filters
  const { status, search: searchRaw, assignee } = variables?.filters ?? {}
  const search = searchRaw?.trim().toLowerCase()

  if (status) {
    tasks = tasks.filter((t) => t.status === status)
  }

  if (assignee) {
    tasks = tasks.filter((t) => t.assigneeId === assignee)
  }

  if (search) {
    tasks = tasks.filter((t) => {
      const title = (t.title ?? '').toLowerCase()
      const desc = (t.description ?? '').toLowerCase()
      return title.includes(search) || desc.includes(search)
    })
  }

  // Sort by creation date descending (newest first)
  tasks.sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime()
    const dateB = new Date(b.createdAt).getTime()
    return dateB - dateA
  })

  // Pagination
  const total = tasks.length
  const page = variables?.pagination?.page ?? 1
  const pageSize = variables?.pagination?.pageSize ?? 10
  const start = Math.max(0, (page - 1) * pageSize)
  const paginated = tasks.slice(start, start + pageSize)

  // Attach assignee object
  const enrichedTasks = paginated.map((task) => {
    const assigneeUser = users.find((u) => u.id === task.assigneeId) || null

    return {
      ...task,
      assignee: assigneeUser
        ? {
            id: assigneeUser.id,
            name: assigneeUser.name,
            email: assigneeUser.email,
            role: assigneeUser.role,
          }
        : null,
    }
  })

  return {
    data: enrichedTasks,
    metadata: {
      total,
      page,
      pageSize,
    },
  }
}

// Update Task Handler
export const updateTask = async (id: string, updates: Partial<Task>): Promise<Task | null> => {
  const tasks = await db.getTasks()
  const task = tasks.find((t) => t.id === id)
  if (!task) return null

  Object.assign(task, updates, { updatedAt: new Date().toISOString() })
  await db.setTasks(tasks)

  // Notify assignee via Pusher
  if (task.assigneeId) {
    await pusherServer.trigger(`user-${task.assigneeId}`, 'task-updated', {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      assigneeId: task.assigneeId,
      updatedAt: task.updatedAt,
    })
  }

  return task
}

// Delete Task Handler
export const deleteTask = async (id: string): Promise<boolean> => {
  const tasks = await db.getTasks()
  const idx = tasks.findIndex((t) => t.id === id)
  if (idx === -1) return false

  const [deletedTask] = tasks.splice(idx, 1)
  await db.setTasks(tasks)

  // Notify assignee via Pusher
  if (deletedTask.assigneeId) {
    await pusherServer.trigger(`user-${deletedTask.assigneeId}`, 'task-deleted', {
      id: deletedTask.id,
      title: deletedTask.title,
      description: deletedTask.description,
      assigneeId: deletedTask.assigneeId,
    })
  }

  return true
}
