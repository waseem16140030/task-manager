import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { User } from "@/graphql/generated/graphql";

interface UserStore {
  users: User[];
  getUsers: () => User[];
  addUser: (user: User) => void;
  removeUserById: (id: string) => void;
  updateUserRole: (id: string, role: User["role"]) => void;
  updateUserById: (id: string, newData: Partial<User>) => void;
}

export function generateMockUsers(): User[] {
  return [{
    id: 'waseem6140030',
    name: 'Muhammad Waseem',
    password:'admin@6Well',
    email: 'waseem16140030@gmail.com',
    phone: `+1${Math.floor(1000000000 + Math.random() * 9000000000)}`,
    country: "Pakistan",
    role: "admin",
    status: "active",
    registrationDate: new Date(
      Date.now() - Math.random() * 31536000000
    ).toISOString(),
  }]
}


export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      users: generateMockUsers(),
      getUsers: () => get().users,
      addUser: (user: User) =>
        set((state) => ({ users: [user, ...state.users] })),
      removeUserById: (id: string) =>
        set((state) => ({
          users: state.users.filter((user) => user.id !== id),
        })),
      updateUserRole: (id, role) =>
        set((state) => ({
          users: state.users.map((user) =>
            user.id === id ? { ...user, role } : user
          ),
        })),
      updateUserById: (id, newData: Partial<User>) =>
        set((state) => ({
          users: state.users.map((user) =>
            user.id === id ? { ...user, ...newData } : user
          ),
        })),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
