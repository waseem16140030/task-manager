'use client'
import { MyModalRef, TMModal, TMText, TMTitle } from '@/app/components'
import { useGlobalNotification } from '@/app/providers'
import { useDeleteUserMutation, useGetUsersQuery } from '@/graphql/generated/graphql'
import { DeleteFilled } from '@ant-design/icons'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from 'antd'
import { Ref, useRef } from 'react'

export interface DeleteUserProps {
  userId: string
}

export interface DeleteUserModalProps extends DeleteUserProps {
  modalRef: Ref<MyModalRef>
}

export function DeleteUser({ userId }: DeleteUserProps) {
  const modalRef = useRef<MyModalRef>(null)
  return (
    <>
      <Button color="danger" variant="outlined" onClick={() => modalRef.current?.open()}>
        <DeleteFilled />
      </Button>
      <DeleteUserModal modalRef={modalRef} userId={userId} />
    </>
  )
}

function DeleteUserModal({ modalRef, userId }: DeleteUserModalProps) {
  //Hooks
  const queryClient = useQueryClient()
  const { openNotification } = useGlobalNotification()

  const { mutateAsync: deleteUser, isPending } = useDeleteUserMutation({
    onSuccess: () => {
      openNotification({
        type: 'success',
        description: 'User has been deleted successfully!',
      })
      queryClient.invalidateQueries({
        queryKey: useGetUsersQuery.getKey(),
        exact: false,
      })
    },
    onError: (error: Error) => {
      openNotification({
        type: 'error',
        description: error.message ?? 'Failed to delete user',
      })
    },
  })

  const handleDelete = async () => {
    await deleteUser({
      id: userId,
    })
  }

  return (
    <TMModal
      ref={modalRef}
      title="Delete User"
      okText="Yes, Confirm"
      confirmLoading={isPending}
      onConfirm={handleDelete}
      okButtonProps={{
        variant: 'solid',
        type: 'default',
        color: 'danger',
      }}
    >
      <div className="tw:flex tw:flex-col tw:items-center tw:justify-center tw:h-48">
        <TMTitle className="tw:!mb-1" level={5}>
          Are you sure you want to delete this user?
        </TMTitle>
        <TMText type="secondary">All user data and account will be permanently deleted.</TMText>
      </div>
    </TMModal>
  )
}
