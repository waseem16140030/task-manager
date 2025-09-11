import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    accessToken?: string;
    role?: string;
    name?: string;
    status?:string
  }

  interface Session extends DefaultSession {
    accessToken?: string;
    user: User;
    status?:string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    role?: string;
    name?: string;
    status?:string
  }
}
