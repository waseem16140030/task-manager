'use client'
import { useGlobalNotification } from '@/app/providers'
import {
  CreateUserMutationVariables,
  useCreateUserMutation,
  useGetUsersQuery,
} from '@/graphql/generated/graphql'
import { UserAddOutlined } from '@ant-design/icons'
import { yupResolver } from '@hookform/resolvers/yup'
import { useQueryClient } from '@tanstack/react-query'
import { Ref, useRef } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { AddUserForm } from './add-user-form'
import { Button } from 'antd'
import { MyModalRef, TMModal } from '@/app/components'
import { userSchema } from '@/app/lib'

export interface AddUserModalProps {
  modalRef: Ref<MyModalRef>
}

export function AddUser() {
  const ref = useRef<MyModalRef>(null)
  return (
    <>
      <Button type="primary" icon={<UserAddOutlined />} onClick={() => ref.current?.open()}>
        Add User
      </Button>
      <AddUserModal modalRef={ref} />
    </>
  )
}

function AddUserModal({ modalRef }: AddUserModalProps) {
  //Hooks
  const queryClient = useQueryClient()
  const { openNotification } = useGlobalNotification()

  //Form Hooks
  const methods = useForm<CreateUserMutationVariables>({
    resolver: yupResolver(userSchema),
    mode: 'all',
  })
  const { reset, handleSubmit } = methods

  //Mutation
  const { mutateAsync: createNewUser, isPending } = useCreateUserMutation({
    onSuccess: () => {
      openNotification({
        type: 'success',
        description: 'User has been added successfully!',
      })
      reset()
      queryClient.invalidateQueries({
        queryKey: useGetUsersQuery.getKey(),
        exact: false,
      })
      if (modalRef && 'current' in modalRef) {
        modalRef.current?.close()
      }
    },
    onError: (error: Error) => {
      openNotification({
        type: 'error',
        description: error?.message ?? 'Failed to create user',
      })
    },
  })

  const handleAddNewUser = async (data: CreateUserMutationVariables) => {
    await createNewUser(data)
  }

  return (
    <TMModal
      okButtonProps={{
        icon: <UserAddOutlined />,
        htmlType: 'submit',
      }}
      width={700}
      ref={modalRef}
      title="Add New User"
      okText="Yes, Add"
      maskClosable={false}
      confirmLoading={isPending}
      onCancel={reset}
      afterClose={reset}
      modalRender={(dom) => <form onSubmit={handleSubmit(handleAddNewUser)}>{dom}</form>}
    >
      <FormProvider {...methods}>
        <AddUserForm />
      </FormProvider>
    </TMModal>
  )
}
