````markdown
# Task Manager - Next.js Project

![Lint, Format, Type Check](https://github.com/waseem16140030/task-manager/actions/workflows/lint.yml/badge.svg)
![Semantic Rules Check](https://github.com/waseem16140030/task-manager/actions/workflows/semantic-rules.yml/badge.svg)

This is a **Next.js 13+ (App Router)** project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app), featuring a **Task & User Management System** with JWT authentication, role-based access, persistent storage on **Redis (Upstash)**, and **real-time notifications using Pusher**.

## Environment Variables

Create a `.env.local` file in the root of your project and add the following:

```env
NEXT_PUBLIC_API_URL="http://localhost:3000/api/graphql"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="hkHMjjHfNMt23cTTXq+jAlGnnKoAJSl5vUw4JXwcN48="

# Redis / Upstash
KV_URL="rediss://default:AThoAAIncDEyNTVmYTc4ZGM3ZDc0MjFhODBiYzEzMzliYjU4Mzk4M3AxMTQ0NDA@golden-vervet-14440.upstash.io:6379"
KV_REST_API_URL="https://golden-vervet-14440.upstash.io"
KV_REST_API_TOKEN="AThoAAIncDEyNTVmYTc4ZGM3ZDc0MjFhODBiYzEzMzliYjU4Mzk4M3AxMTQ0NDA"
KV_REST_API_READ_ONLY_TOKEN="AjhoAAIgcDEQESyQD0rkcRZ6S50-Pt_Yc1Lm8s0h_qgHr3X3em7UBw"
REDIS_URL="rediss://default:AThoAAIncDEyNTVmYTc4ZGM3ZDc0MjFhODBiYzEzMzliYjU4Mzk4M3AxMTQ0NDA@golden-vervet-14440.upstash.io:6379"

# Pusher (Real-time notifications)
PUSHER_APP_ID=2049916
PUSHER_KEY=0fe6c94c9521201a7a7c
PUSHER_SECRET=78d3f8d88b38db7dcbf6
PUSHER_CLUSTER=ap3

NEXT_PUBLIC_PUSHER_KEY=0fe6c94c9521201a7a7c
NEXT_PUBLIC_PUSHER_CLUSTER=ap3
```
````

> **Production**: Update `NEXT_PUBLIC_API_URL` and `NEXTAUTH_URL` to your deployed URL (e.g., Vercel).

---

## 🚀 Live Demo

👉 [Task Manager - Deployed on Vercel](https://task-manager-rouge-seven.vercel.app/tasks-management)

---

## Default SuperAdmin Account

On first run, the system creates a **SuperAdmin** account:

```
Email:    waseem16140030@gmail.com
Password: admin@6Well
```

### Role Rules

- `superAdmin` and `admin` → Full access including **User Management**.
- `user` → Limited access, cannot manage users.
- Registration always creates `user` role accounts.
- Admin-created users start with default password `password@123`.

---

## Features

### User Management

- Only **admin** and **superAdmin** can access User Management.
- Add, update, activate/deactivate, and delete users.
- Registration form creates `user` role accounts.
- SuperAdmin account is seeded at first initialization.

### Task Management

- Create, update, and delete tasks.
- Filter tasks by status, assignee, or search keyword.
- Pagination and sorting.
- Timestamps for `createdAt` and `updatedAt`.
- Task statuses: `Backlog`, `In Progress`, `Completed`.
- **Real-time notifications** via **Pusher** for:
  - Task assigned
  - Task updated
  - Task deleted

### Authentication & Authorization

- JWT-based authentication using **NextAuth.js** with credentials provider.
- Role-based route protection (middleware + UI).
- Redirect rules:
  - Logged-in `user` cannot access `/` (redirected to `/tasks-management`).
  - Already logged-in users cannot revisit `/auth/signin`.

### Persistence

- Uses **Redis (Upstash)** for server-side storage.
- Data persists across sessions and supports high concurrency.

### Forms & Validation

- Forms managed via `react-hook-form`.
- Schema validation using `yup`.
- Custom error messages for required fields.

### UI & Components

- Built with **Ant Design**.
- Fully responsive layout.
- Custom components: `InputField`, `PasswordField`, `TMText`, `Button`, etc.
- Global notification system via `useGlobalNotification`.

---

## Getting Started

Clone the repository and install dependencies:

```bash
git clone https://github.com/waseem16140030/task-manager.git
cd task-manager
npm install
# or
yarn
# or
pnpm install
```

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Architecture

```
app/
├─ auth/
│  ├─ signin/
│  └─ register/
├─ dashboard/
├─ tasks-management/
├─ users-management/
lib/
├─ db.ts          # Redis / Upstash DB interface
├─ services/
│  ├─ auth.ts
│  ├─ login.ts
│  ├─ tasks.ts
│  └─ users.ts
├─ pusher-server.ts
components/
├─ InputField.tsx
├─ PasswordField.tsx
├─ TMText.tsx
├─ Button.tsx
...
```

- **`lib/db.ts`** → Connects to Upstash Redis.
- **`lib/pusher-server.ts`** → Server-side Pusher instance for real-time notifications.
- **`lib/services`** → Server actions for login, users, and tasks.
- **`components`** → Reusable UI components with Ant Design.
- **`app`** → Next.js routes for auth, dashboard, tasks, users.

---

## Deployment on Vercel

1. Push your project to a Git repository.
2. Import your project into [Vercel](https://vercel.com/new).
3. Add environment variables (Redis + Pusher + NextAuth) in Vercel dashboard.
4. Deploy the project. **Real-time notifications work automatically** without custom server setup.

---

## License

This project is open source and available under the MIT License.

```

✅ This version clearly documents:

- Redis/Upstash as the database instead of lowdb
- Pusher-based real-time notifications (assign, update, delete)
- Updated environment variables

```
