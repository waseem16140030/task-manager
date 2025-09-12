'use client'
import { MyModalRef, TMModal } from '@/app/components'
import { EditOutlined } from '@ant-design/icons'
import { Ref, useEffect, useRef } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { AddTaskForm, TaskInput } from '.'
import { useQueryClient } from '@tanstack/react-query'
import { useGlobalNotification } from '@/app/providers'
import { addTaskSchema } from '@/app/lib'
import { yupResolver } from '@hookform/resolvers/yup'
import { Task, useGetTasksQuery, useUpdateTaskMutation } from '@/graphql/generated/graphql'

export interface EditTaskProps {
  taskData: Task
}

export interface EditTaskModalProps extends EditTaskProps {
  modalRef: Ref<MyModalRef>
}
export function EditTask({ taskData }: EditTaskProps) {
  const ref = useRef<MyModalRef>(null)
  return (
    <>
      <EditOutlined
        onClick={() => ref.current?.open()}
        style={{
          fontSize: 18,
        }}
      />
      <EditTaskModal modalRef={ref} taskData={taskData} />
    </>
  )
}

function EditTaskModal({ modalRef, taskData }: EditTaskModalProps) {
  const queryClient = useQueryClient()
  const { openNotification } = useGlobalNotification()

  //Form Hooks
  const methods = useForm<TaskInput>({
    resolver: yupResolver(addTaskSchema),
    mode: 'all',
  })
  const { reset, handleSubmit } = methods

  useEffect(() => {
    if (taskData) {
      reset({
        title: taskData.title,
        description: taskData.description ?? '',
        assigneeId: taskData.assigneeId ?? '',
      })
    }
  }, [taskData, reset])

  //Mutation
  const { mutateAsync: updateTaskFn, isPending } = useUpdateTaskMutation({
    onSuccess: () => {
      openNotification({
        type: 'success',
        description: 'Task has been updated successfully!',
      })
      reset()
      queryClient.invalidateQueries({
        queryKey: useGetTasksQuery.getKey(),
        exact: false,
      })
      if (modalRef && 'current' in modalRef) {
        modalRef.current?.close()
      }
    },
    onError: (error: Error) => {
      openNotification({
        type: 'error',
        description: error?.message ?? 'Failed to update task',
      })
    },
  })

  const handleEditTask = async (data: TaskInput) => {
    const { id } = taskData ?? {}
    await updateTaskFn({
      id,
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
      width={700}
      ref={modalRef}
      title="Edit Task"
      okText="Yes, Edit"
      maskClosable={false}
      confirmLoading={isPending}
      onCancel={reset}
      afterClose={reset}
      modalRender={(dom) => <form onSubmit={handleSubmit(handleEditTask)}>{dom}</form>}
    >
      <FormProvider {...methods}>
        <AddTaskForm />
      </FormProvider>
    </TMModal>
  )
}
