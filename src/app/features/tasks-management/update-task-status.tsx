'use client'
import { useGlobalNotification } from '@/app/providers'
import { useTaskStatusOptions } from '@/app/shared/utils/hooks/useTasks'
import { Task, useGetTasksQuery, useUpdateTaskMutation } from '@/graphql/generated/graphql'
import { HistoryOutlined, SettingOutlined } from '@ant-design/icons'
import { useQueryClient } from '@tanstack/react-query'
import { Dropdown, MenuProps } from 'antd'

export interface UpdateTaskStatusProps {
  taskData: Task
}

export function UpdateTaskStatus({ taskData }: UpdateTaskStatusProps) {
  const options = useTaskStatusOptions()
  const queryClient = useQueryClient()
  const { openNotification } = useGlobalNotification()

  const { mutateAsync: updateTaskStatusFn, isPending } = useUpdateTaskMutation({
    onSuccess: () => {
      openNotification({
        type: 'success',
        description: 'Status has been updated successfully!',
      })
      queryClient.invalidateQueries({
        queryKey: useGetTasksQuery.getKey(),
        exact: false,
      })
    },
    onError: (error: Error) => {
      openNotification({
        type: 'error',
        description: error?.message ?? 'Failed to update status',
      })
    },
  })

  const handleUpdateStatus: MenuProps['onClick'] = async ({ key }) => {
    await updateTaskStatusFn({
      id: taskData.id,
      input: {
        ...taskData,
        status: key,
      },
    })
  }

  const items: MenuProps['items'] = options.map((item) => ({
    key: item.value,
    label: item.label,
  }))

  return (
    <Dropdown
      placement="bottomRight"
      overlayStyle={{
        width: 150,
      }}
      trigger={['click']}
      menu={{
        items,
        onClick: handleUpdateStatus,
      }}
    >
      <HistoryOutlined
        spin={isPending}
        style={{
          fontSize: 18,
        }}
      />
    </Dropdown>
  )
}
