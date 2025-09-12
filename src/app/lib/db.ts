import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import path from 'path'
import fs from 'fs'
import type { User, Task } from '@/graphql/generated/graphql'

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

// ✅ Ensure "data" directory exists
const dataDir = path.join(process.cwd(), 'data')
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

// Path to JSON file
const file = path.join(dataDir, 'db.json')

// LowDB setup
const adapter = new JSONFile<Database>(file)
export const db = new Low<Database>(adapter, defaultData)

export async function initializeDB() {
  await db.read()
  if (!db.data) {
    db.data = defaultData
    await db.write()
  }
  return db
}
