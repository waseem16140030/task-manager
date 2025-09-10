"use server";
import { cookies } from "next/headers";
import { customFetcher } from "@/app/lib/customFetcher";
import {
  LoginDocument,
  type LoginMutation,
  type LoginMutationVariables,
} from "@/graphql/generated/graphql";

export async function loginServerAction(params: {
  email: string;
  password: string;
}) {
  const loginFn = customFetcher<LoginMutation, LoginMutationVariables>(
    LoginDocument,
    {
      input: {
        email: params.email,
        password: params.password,
      },
    }
  );

  const userResponse = await loginFn();
  const { login } = userResponse ?? {};

  if (!login?.user || !login?.token) {
    return null;
  }

  const cookiesStore = await cookies();
  cookiesStore.set("token", login.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return {
    token: login.token,
    user: login.user,
  };
}
