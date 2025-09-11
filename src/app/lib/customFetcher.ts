import { getServerSession, Session } from "next-auth";
import { getSession } from "next-auth/react";
import { authOptions } from ".";

interface AuthSession extends Session {
  accessToken?: string;
}

export const customFetcher = <TData, TVariables>(
  query: string,
  variables?: TVariables,
  options?: RequestInit["headers"]
): (() => Promise<TData>) => {
  return async () => {
    const endPoint = process.env.NEXT_PUBLIC_API_URL!;
    const isServer = typeof window === "undefined";
    let session: AuthSession | null = null;

    if (isServer) {
      session = await getServerSession(authOptions);
    } else {
      session = await getSession();
    }

    const token = session?.accessToken;

    const res = await fetch(endPoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const json = await res.json();

    if (json.errors) {
      const { message } = json.errors[0] ?? {};
      throw new Error(message ?? "Error…");
    }

    return json.data;
  };
};
