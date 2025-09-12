'use client'
import { useEffect } from 'react'
import PusherClient from 'pusher-js'
import { Task } from '@/graphql/generated/graphql'
import { useGlobalNotification } from '@/app/providers'

export const usePusher = (userId: string) => {
  const { openNotification } = useGlobalNotification()

  useEffect(() => {
    if (!userId) return

    const pusher = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    })

    const channel = pusher.subscribe(`user-${userId}`)

    channel.bind('task-assigned', (data: Partial<Task>) => {
      openNotification({
        type: 'info',
        message: `📌 New Task Assigned: ${data.title}`,
        description: data.description ?? 'You have a new task assigned.',
        duration: 0,
        closable: true,
      })
    })

    // Task Updated
    channel.bind('task-updated', (data: Partial<Task>) => {
      openNotification({
        type: 'success',
        message: `✏️ Task Updated: ${data.title}`,
        description: data.description ?? 'The task details have been updated.',
        duration: 0,
        closable: true,
      })
    })

    // Task Deleted
    channel.bind('task-deleted', (data: Partial<Task>) => {
      openNotification({
        type: 'error',
        message: `🗑 Task Deleted: ${data.title}`,
        description: data.description ?? 'This task has been removed.',
        duration: 0,
        closable: true,
      })
    })

    return () => {
      channel.unbind_all()
      channel.unsubscribe()
      pusher.disconnect()
    }
  }, [userId, openNotification])
}
