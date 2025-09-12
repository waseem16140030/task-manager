'use client'
import { InputField, PasswordField, SelectField, TMText } from '@/app/components'
import { registerSchema } from '@/app/lib'
import { useGlobalNotification } from '@/app/providers'
import { useUserOptions } from '@/app/shared/utils'
import { RegisterInput, useCreateUserMutation, useGetUsersQuery } from '@/graphql/generated/graphql'
import { yupResolver } from '@hookform/resolvers/yup'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from 'antd'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'

export function RegisterForm() {
  //Hooks
  const { countries } = useUserOptions()
  const queryClient = useQueryClient()
  const { openNotification } = useGlobalNotification()
  const { replace } = useRouter()

  //Form Hooks
  const methods = useForm<RegisterInput>({
    resolver: yupResolver(registerSchema),
    mode: 'all',
  })
  const { reset, handleSubmit } = methods

  //Mutation
  const { mutateAsync: createNewUser, isPending } = useCreateUserMutation({
    onSuccess: () => {
      replace('/auth/register/success')
      reset()
      queryClient.invalidateQueries({
        queryKey: useGetUsersQuery.getKey(),
        exact: false,
      })
    },
    onError: (error: Error) => {
      openNotification({
        type: 'error',
        description: error?.message ?? 'Failed to create user',
      })
    },
  })

  const handleAddNewUser = async (data: RegisterInput) => {
    await createNewUser({
      ...data,
      status: 'active',
      role: 'user',
    })
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleAddNewUser)}>
        <div className="tw:flex tw:flex-col tw:gap-y-5 tw:!my-4">
          <InputField name="name" label="Name" placeholder="Enter your name" />
          <InputField name="email" label="Email" placeholder="Enter your email" />
          <InputField name="phone" label="Phone" placeholder="Enter your phone" />
          <PasswordField name="password" label="Password" placeholder="Enter your password" />
          <SelectField
            name="country"
            label="Country"
            placeholder="Select country"
            options={countries}
          />
        </div>
        <div className="tw:flex tw:flex-col tw:gap-y-3 tw:pt-2">
          <Button type="primary" block htmlType="submit" loading={isPending}>
            Register
          </Button>
          <div className="tw:flex tw:items-center tw:gap-x-2">
            <TMText>Already have an Account?</TMText>
            <Link href="/auth/signin">
              <Button className="tw:!px-0" variant="text" type="link">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </form>
    </FormProvider>
  )
}
