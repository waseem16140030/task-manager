"use client";
import { InputField, PasswordField } from "@/app/components";
import { useGlobalNotification } from "@/app/providers";
import { Button, Typography } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoginInput, useLoginMutation } from "@/graphql/generated/graphql";
import { loginSchema } from "@/app/lib";
import { useAuthStore } from "@/app/lib/stores";
import Cookies from "js-cookie";

export function SignInForm() {
  const { replace } = useRouter();
  const { openNotification } = useGlobalNotification();
  const { login } = useAuthStore();

  const { mutateAsync: handleLogin, isPending } = useLoginMutation({
    onSuccess: () => {
      replace("/");
    },
    onError: () => {
      openNotification({
        type: "error",
        description: "Invalid credentials or server error",
      });
    },
  });

  const { Text } = Typography;

  const methods = useForm<LoginInput>({
    resolver: yupResolver(loginSchema),
  });
  const { handleSubmit } = methods;

  const onSubmitLogin = async (data: LoginInput) => {
    const { email, password } = data;
    const { login: loginResponse } = await handleLogin({
      input: {
        email,
        password,
      },
    });
    const { user, token } = loginResponse ?? {};
    if (token) {
      Cookies.set("authToken", token, { expires: 7, path: "/" });
    }
    login(user, token);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmitLogin)}>
        <div className="tw:flex tw:flex-col tw:gap-y-6">
          <InputField label="Email" name="email" placeholder="Enter email" />
          <PasswordField
            label="Password"
            name="password"
            placeholder="Enter password"
          />
          <div className="tw:flex tw:flex-col tw:gap-y-4">
            <Link className="tw:text-right" href="/auth/forgot-password">
              <Button className="tw:!px-0" variant="text" type="link">
                Forgot Password ?
              </Button>
            </Link>
            <Button htmlType="submit" type="primary" loading={isPending}>
              Sign In
            </Button>
            <div className="tw:flex tw:items-center tw:gap-x-2">
              <Text>New to TM ?</Text>
              <Link href="#">
                <Button className="tw:!px-0" variant="text" type="link">
                  Create an account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
