"use server";
import { cookies } from "next/headers";
export const cleanup = async () => {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  for (const cookie of allCookies) {
    cookieStore.delete(cookie.name);
  }
};
