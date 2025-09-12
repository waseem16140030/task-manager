// lib/db.ts
import { Redis } from '@upstash/redis'
import type { User, Task } from '@/graphql/generated/graphql'

// Initialize Redis using environment variables
const redis = Redis.fromEnv()

export interface Database {
  users: User[]
  tasks: Task[]
}

const defaultData: Database = {
  users: [
    {
      id: 'waseem6140030',
      name: 'Muhammad Waseem',
      password: 'admin@6Well',
      email: 'waseem16140030@gmail.com',
      phone: `+1${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      country: 'Pakistan',
      role: 'superAdmin',
      status: 'active',
      registrationDate: new Date().toISOString(),
    },
  ],
  tasks: [],
}

export const db = {
  // Users
  getUsers: async (): Promise<User[]> => {
    try {
      const users = await redis.get<User[]>('users')
      return users || defaultData.users
    } catch (error) {
      console.error('Error getting users from Redis:', error)
      return defaultData.users
    }
  },

  setUsers: async (users: User[]): Promise<void> => {
    try {
      await redis.set('users', users)
    } catch (error) {
      console.error('Error setting users in Redis:', error)
    }
  },

  // Tasks
  getTasks: async (): Promise<Task[]> => {
    try {
      const tasks = await redis.get<Task[]>('tasks')
      return tasks || defaultData.tasks
    } catch (error) {
      console.error('Error getting tasks from Redis:', error)
      return defaultData.tasks
    }
  },

  setTasks: async (tasks: Task[]): Promise<void> => {
    try {
      await redis.set('tasks', tasks)
    } catch (error) {
      console.error('Error setting tasks in Redis:', error)
    }
  },

  // Initialize with default data if empty
  initialize: async (): Promise<void> => {
    try {
      const currentUsers = await redis.get<User[]>('users')
      const currentTasks = await redis.get<Task[]>('tasks')

      if (!currentUsers) {
        await redis.set('users', defaultData.users)
      }

      if (!currentTasks) {
        await redis.set('tasks', defaultData.tasks)
      }
    } catch (error) {
      console.error('Error initializing Redis:', error)
    }
  },
}

// Initialize the database on import
db.initialize()
