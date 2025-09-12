import { TaskStatus } from '@/graphql/generated/graphql'
import { RibbonProps } from 'antd/es/badge/Ribbon'
import { useMemo } from 'react'

export const statusTitleMap: Record<TaskStatus, string> = {
  [TaskStatus.Backlog]: 'Backlog',
  [TaskStatus.Blocked]: 'Blocked',
  [TaskStatus.Cancelled]: 'Cancelled',
  [TaskStatus.Done]: 'Done',
  [TaskStatus.InProgress]: 'InProgress',
  [TaskStatus.InReview]: 'InReview',
  [TaskStatus.Todo]: 'Todo',
}

export const statusColorMap: Record<TaskStatus, RibbonProps['color']> = {
  [TaskStatus.Backlog]: 'blue',
  [TaskStatus.Blocked]: 'red',
  [TaskStatus.Cancelled]: 'cyan',
  [TaskStatus.Done]: 'green',
  [TaskStatus.InProgress]: 'purple',
  [TaskStatus.InReview]: 'yellow',
  [TaskStatus.Todo]: 'gold',
}

export function useTaskStatusOptions() {
  return useMemo(
    () =>
      Object.values(TaskStatus).map((status) => ({
        value: status,
        label: statusTitleMap[status],
      })),
    [],
  )
}
