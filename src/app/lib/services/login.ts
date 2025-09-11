"use server";

import { verifyUserCredentials, generateJWT } from "@/app/lib"; // your existing helpers
import { User } from "@/graphql/generated/graphql";

export async function loginAction(credentials: {
  email: string;
  password: string;
}) {
  try {
    const user = await verifyUserCredentials(
      credentials.email,
      credentials.password
    );

    if (!user) {
      throw new Error("Invalid email or password");
    }

    if (user.status !== "active") {
      throw new Error("Account is not active");
    }

    // generate token with your util
    const token = generateJWT(user);

    // return the user without password
    const { password, ...safeUser } = user as User & { password?: string };

    return {
      token,
      user: safeUser,
    };
  } catch (err: unknown) {
    const newError = err as Error;
    throw new Error(newError?.message ?? "Login failed");
  }
}
