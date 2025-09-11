Absolutely! Here's a fully formatted `README.md` file that you can copy and paste directly into your project:

````markdown
# Task Manager - Next.js Project

This is a **Next.js 13+ (App Router)** project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app), featuring a **Task & User Management System** with JWT authentication, role-based access, and Zustand state management.

---

## Environment Variables

Create a `.env.local` file in the root of your project and add the following:

```env
NEXT_PUBLIC_API_URL="http://localhost:3000/api/graphql"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="hkHMjjHfNMt23cTTXq+jAlGnnKoAJSl5vUw4JXwcN48="
````

> **Production**: Update `NEXT_PUBLIC_API_URL` and `NEXTAUTH_URL` to your deployed URL (e.g., Vercel).

---

## Features

### User Management

* Create, update, and delete users
* Role-based access: `admin`, `user` (superAdmin is hidden from UI)
* Active/inactive status handling
* User registration with **password validation**:

  * Minimum 8 characters
  * At least 1 uppercase letter
  * At least 1 lowercase letter
  * At least 1 number
  * At least 1 special character
* Fetch user configuration lists (active users)
* Filter, sort, and paginate user lists
* Passwords are never exposed in returned data

### Task Management

* Create, update, and delete tasks
* Filter tasks by status or search keyword
* Pagination and sorting
* Timestamps for `createdAt` and `updatedAt`
* Task statuses: `Backlog`, `In Progress`, `Completed`

### Authentication & Authorization

* JWT-based authentication using **NextAuth.js** with credentials provider
* Sign-in and sign-out flows
* Secure session handling with `accessToken` and role info
* Server-side session retrieval via `getServerAuthSession`
* SuperAdmin users are excluded from user lists in UI

### State Management

* Global state with **Zustand**
* Persistence in local storage using `zustand/persist`
* Server-side hydration for initial state
* Separate stores for users and tasks
* Mock initial data for development

### Forms & Validation

* Forms managed via `react-hook-form`
* Schema validation using `yup`
* Password, email, and phone validation
* Custom error messages for required fields

### UI & Components

* Built with **Ant Design**
* Fully responsive layout
* Custom components: `InputField`, `PasswordField`, `TMText`, `Button`, etc.
* Notification system via `useGlobalNotification`

---

## Getting Started

Clone the repository and install dependencies:

```bash
git clone <your-repo-url>
cd <your-project-folder>
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
You can start editing the project under the `app/` directory. Pages auto-update as you edit.

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
│  └─ forgot-password/
├─ dashboard/
├─ tasks-management/
├─ users-management/
lib/
├─ services/
│  ├─ auth.ts
│  ├─ login.ts
│  ├─ tasks.ts
│  └─ users.ts
├─ stores/
│  ├─ userStore.ts
│  └─ taskStore.ts
components/
├─ InputField.tsx
├─ PasswordField.tsx
├─ TMText.tsx
├─ Button.tsx
...
```

* **`lib/services`**: Server-side actions for login, user, and task management.
* **`lib/stores`**: Zustand stores with `persist` middleware for users and tasks.
* **`components`**: Reusable UI components with form support and validation.
* **`app`**: Next.js pages (App Router) for authentication, dashboards, tasks, and users.

---

## Learn More

To learn more about the technologies used:

* [Next.js Documentation](https://nextjs.org/docs)
* [NextAuth.js](https://next-auth.js.org/)
* [Zustand](https://zustand-demo.pmnd.rs/)
* [React Hook Form](https://react-hook-form.com/)
* [Yup Validation](https://github.com/jquense/yup)
* [Ant Design](https://ant.design/)

---

## Deployment on Vercel

1. Push your project to a Git repository.
2. Go to [Vercel](https://vercel.com/new) and import your project.
3. Add the same environment variables (`NEXT_PUBLIC_API_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`) in the Vercel dashboard.
4. Deploy the project.

---

## Notes

* All mock data (users & tasks) is persisted in local storage for development.
* SuperAdmin users are **excluded from user lists** in the UI and `getUsersConfig`.
* JWT tokens are generated locally for demonstration and testing purposes.
* Form validation ensures consistent and secure user input.

---

## License

This project is open source and available under the MIT License.

```

---

```
