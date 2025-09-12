# Task Manager - Next.js Project

This is a **Next.js 13+ (App Router)** project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app), featuring a **Task & User Management System** with JWT authentication, role-based access, and persistent storage using **lowdb**.

---

## Environment Variables

Create a `.env.local` file in the root of your project and add the following:

```env
NEXT_PUBLIC_API_URL="http://localhost:3000/api/graphql"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="hkHMjjHfNMt23cTTXq+jAlGnnKoAJSl5vUw4JXwcN48="
```

> **Production**: Update `NEXT_PUBLIC_API_URL` and `NEXTAUTH_URL` to your deployed URL (e.g., Vercel).

---

## Default SuperAdmin Account

On first run, the database is seeded with a **SuperAdmin** account:

```
Email:    waseem16140030@gmail.com
Password: admin@6Well
```

### Role Rules
- `superAdmin` and `admin` → Full access, including **User Management**.  
- `user` → Limited access, cannot see or manage users.  
- **Registration** (sign-up) always creates a `user` role.  
- Admins can add users manually (default password = `password@123`).  

---

## Features

### User Management
* Only **admin** and **superAdmin** can access User Management.
* Add, update, activate/deactivate, and delete users.
* Registration form creates `user` role accounts only.
* Admin-created users get a default password `password@123` (user can later change).
* SuperAdmin account is seeded in the database at first initialization.

### Task Management
* Create, update, and delete tasks.
* Filter tasks by status or search keyword.
* Pagination and sorting.
* Timestamps for `createdAt` and `updatedAt`.
* Task statuses: `Backlog`, `In Progress`, `Completed`.

### Authentication & Authorization
* JWT-based authentication using **NextAuth.js** with credentials provider.
* Role-based route protection (middleware + UI).
* Redirect rules:
  * Logged-in `user` cannot access `/` (redirected to `/tasks-management`).
  * Already logged-in users cannot revisit `/auth/signin`.

### Persistence
* Data is stored in a **JSON file** using [lowdb](https://github.com/typicode/lowdb).
* File: `data/db.json`
* Persists across sessions like a real database.

### Forms & Validation
* Forms managed via `react-hook-form`.
* Schema validation using `yup`.
* Password, email, and phone validation.
* Custom error messages for required fields.

### UI & Components
* Built with **Ant Design**.
* Fully responsive layout.
* Custom components: `InputField`, `PasswordField`, `TMText`, `Button`, etc.
* Notification system via `useGlobalNotification`.

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

## Scripts

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

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
├─ db.ts          # lowdb database initialization
├─ services/
│  ├─ auth.ts
│  ├─ login.ts
│  ├─ tasks.ts
│  └─ users.ts
components/
├─ InputField.tsx
├─ PasswordField.tsx
├─ TMText.tsx
├─ Button.tsx
...
```

* **`lib/db.ts`** → Initializes lowdb with default SuperAdmin + empty tasks.  
* **`lib/services`** → Server actions for login, users, and tasks.  
* **`components`** → Reusable UI components with Ant Design.  
* **`app`** → Next.js routes for auth, dashboard, tasks, users.

---

## Deployment on Vercel

1. Push your project to a Git repository.
2. Go to [Vercel](https://vercel.com/new) and import your project.
3. Add the same environment variables (`NEXT_PUBLIC_API_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`) in the Vercel dashboard.
4. Deploy the project.

---

## Notes

* Database uses **lowdb** JSON file for persistence.  
* Only `admin` and `superAdmin` can access User Management.  
* Registration always creates a `user` role.  
* Admin-created users start with default password `password@123`.  
* SuperAdmin account is pre-seeded at startup.  

---

## License

This project is open source and available under the MIT License.
