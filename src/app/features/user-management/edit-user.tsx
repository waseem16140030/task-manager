'use client'
import {
  CreateUserMutationVariables,
  EditUserInput,
  useEditUserMutation,
  useGetUsersQuery,
  User,
} from '@/graphql/generated/graphql'
import { Ref, useEffect, useRef } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { AddUserForm } from './add-user-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { EditFilled, EditOutlined } from '@ant-design/icons'
import { useGlobalNotification } from '@/app/providers'
import { useQueryClient } from '@tanstack/react-query'
import { userSchema } from '@/app/lib'
import { MyModalRef, TMModal } from '@/app/components'
import { Button } from 'antd'

export interface EditUserProps {
  userData: User
}

export interface EditUserModalProp extends EditUserProps {
  modalRef: Ref<MyModalRef>
}

export function EditUser({ userData }: EditUserProps) {
  const modalRef = useRef<MyModalRef>(null)
  return (
    <>
      <Button color="primary" variant="outlined" onClick={() => modalRef.current?.open()}>
        <EditFilled />
      </Button>
      <EditUserModal modalRef={modalRef} userData={userData} />
    </>
  )
}

function EditUserModal({ modalRef, userData }: EditUserModalProp) {
  const queryClient = useQueryClient()
  const { openNotification } = useGlobalNotification()
  //Form Hooks
  const methods = useForm<CreateUserMutationVariables>({
    resolver: yupResolver(userSchema),
    mode: 'all',
  })
  const { reset, handleSubmit } = methods

  useEffect(() => {
    if (userData) {
      reset({
        name: userData?.name,
        email: userData?.email,
        status: userData?.status ?? '',
        phone: userData?.phone ?? '',
        country: userData?.country ?? '',
        role: userData?.role ?? '',
      })
    }
  }, [userData, reset])

  const { mutateAsync: editUserFn, isPending } = useEditUserMutation({
    onSuccess: () => {
      openNotification({
        type: 'success',
        description: 'User has been updated successfully!',
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
        description: error?.message ?? 'Failed to update user',
      })
    },
  })

  const handleEditUser = async (data: EditUserInput) => {
    const { id } = userData ?? {}
    await editUserFn({
      id: id,
      input: {
        ...data,
      },
    })
  }

  return (
    <TMModal
      okButtonProps={{
        icon: <EditOutlined />,
        htmlType: 'submit',
      }}
      ref={modalRef}
      width={700}
      title="Edit User"
      okText="Yes, Edit"
      maskClosable={false}
      confirmLoading={isPending}
      afterClose={reset}
      onCancel={reset}
      modalRender={(dom) => <form onSubmit={handleSubmit(handleEditUser)}>{dom}</form>}
    >
      <FormProvider {...methods}>
        <AddUserForm />
      </FormProvider>
    </TMModal>
  )
}
