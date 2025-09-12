'use client'
import { InputField, PasswordField, TMText } from '@/app/components'
import { useGlobalNotification } from '@/app/providers'
import { Button } from 'antd'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { LoginInput } from '@/graphql/generated/graphql'
import { loginSchema } from '@/app/lib'
import { useState } from 'react'
import { signIn } from 'next-auth/react'

export function SignInForm() {
  const { replace } = useRouter()
  const { openNotification } = useGlobalNotification()
  const [isLoading, setLoading] = useState(false)

  const methods = useForm<LoginInput>({
    resolver: yupResolver(loginSchema),
  })
  const { handleSubmit } = methods

  const onSubmitLogin = async (data: LoginInput) => {
    const { email, password } = data
    setLoading(true)
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    })

    if (res?.ok) {
      replace('/')
    } else {
      openNotification({
        type: 'error',
        description: 'Invalid credentials or server error',
      })
    }
    setLoading(false)
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmitLogin)}>
        <div className="tw:flex tw:flex-col tw:gap-y-6">
          <InputField label="Email" name="email" placeholder="Enter email" />
          <PasswordField label="Password" name="password" placeholder="Enter password" />
          <div className="tw:flex tw:flex-col tw:gap-y-4">
            <Link className="tw:text-right" href="#">
              <Button className="tw:!px-0" variant="text" type="link">
                Forgot Password ?
              </Button>
            </Link>
            <Button htmlType="submit" type="primary" loading={isLoading}>
              Sign In
            </Button>
            <div className="tw:flex tw:items-center tw:gap-x-2">
              <TMText>New to TM ?</TMText>
              <Link href="/auth/register">
                <Button className="tw:!px-0" variant="text" type="link">
                  Create an account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  )
}
