'use client'
import { MyModalRef, TMModal, TMText, TMTitle } from '@/app/components'
import { useGlobalNotification } from '@/app/providers'
import { useDeleteTaskMutation, useGetTasksQuery } from '@/graphql/generated/graphql'
import { DeleteFilled, DeleteOutlined } from '@ant-design/icons'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from 'antd'
import { Ref, useRef } from 'react'

export interface DeleteTaskProps {
  taskId: string
}

export interface DeleteTaskModalProps extends DeleteTaskProps {
  modalRef: Ref<MyModalRef>
}

export function DeleteTask({ taskId }: DeleteTaskProps) {
  const modalRef = useRef<MyModalRef>(null)
  return (
    <>
      <DeleteOutlined
        onClick={() => modalRef.current?.open()}
        style={{
          fontSize: 18,
        }}
      />
      <DeleteTaskModal modalRef={modalRef} taskId={taskId} />
    </>
  )
}

function DeleteTaskModal({ modalRef, taskId }: DeleteTaskModalProps) {
  //Hooks
  const queryClient = useQueryClient()
  const { openNotification } = useGlobalNotification()

  const { mutateAsync: deleteTaskFn, isPending } = useDeleteTaskMutation({
    onSuccess: () => {
      openNotification({
        type: 'success',
        description: 'Task has been deleted successfully!',
      })
      queryClient.invalidateQueries({
        queryKey: useGetTasksQuery.getKey(),
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

  const handleDeleteTask = async () => {
    await deleteTaskFn({
      id: taskId,
    })
  }

  return (
    <TMModal
      ref={modalRef}
      title="Delete Task"
      okText="Yes, Confirm"
      confirmLoading={isPending}
      onConfirm={handleDeleteTask}
      okButtonProps={{
        variant: 'solid',
        type: 'default',
        color: 'danger',
      }}
    >
      <div className="tw:flex tw:flex-col tw:items-center tw:justify-center tw:h-48">
        <TMTitle className="tw:!mb-1" level={5}>
          Are you sure you want to delete this task?
        </TMTitle>
        <TMText type="secondary">All task data and progress will be permanently deleted.</TMText>
      </div>
    </TMModal>
  )
}
