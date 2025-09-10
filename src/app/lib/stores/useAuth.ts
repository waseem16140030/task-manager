"use client";
import { User } from "@/graphql/generated/graphql";
import { create } from "zustand";
import { persist } from "zustand/middleware";


export type UserType=Omit<User, 'password'>

interface AuthState {
  user: UserType | null;
  token: string | null;
  login: (user?: UserType | null, token?: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: "auth-storage", 
    }
  )
);
