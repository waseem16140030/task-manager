'use client'
import { InputField, SelectField, TextAreaField } from '@/app/components'
import { useGetUsersConfigQuery } from '@/graphql/generated/graphql'
import { useQuery } from '@tanstack/react-query'

export function AddTaskForm() {
  const { data } = useQuery({
    queryKey: useGetUsersConfigQuery.getKey(),
    queryFn: useGetUsersConfigQuery.fetcher(),
  })

  return (
    <div className="tw:flex tw:flex-col tw:gap-y-5 tw:!my-4">
      <InputField name="title" label="Title" placeholder="Enter task title" />
      <TextAreaField
        label="Description"
        name="description"
        placeholder="Enter task description"
        rows={8}
      />
      <SelectField
        fieldNames={{
          value: 'id',
          label: 'name',
        }}
        options={data?.usersConfig}
        name="assigneeId"
        placeholder="Select Assignee"
        label="Assignee"
      />
    </div>
  )
}
