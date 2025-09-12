'use client'
import { SearchInput } from '@/app/components'
import { usePaginatedQueryParams } from '@/app/shared/utils'
import { Badge, Card, List, Select, Typography } from 'antd'
import { AddTask, DeleteTask, EditTask, UpdateTaskStatus } from '.'
import { useQuery } from '@tanstack/react-query'
import { useGetTasksQuery } from '@/graphql/generated/graphql'
import {
  statusColorMap,
  statusTitleMap,
  useTaskStatusOptions,
} from '@/app/shared/utils/hooks/useTasks'

export function TasksList() {
  const {
    handleSearch,
    handlePagination,
    handleSelectChange,
    search,
    current,
    pageSize,
    selectedFilters,
  } = usePaginatedQueryParams({ filterKeys: ['status'] })
  const options = useTaskStatusOptions()

  const queryKey = useGetTasksQuery.getKey({
    filters: {
      search,
      status: selectedFilters.status,
    },
  })
  const queryFn = useGetTasksQuery.fetcher({
    filters: {
      search,
      status: selectedFilters.status,
    },
  })

  const { data: tasksData, isLoading } = useQuery({
    queryKey,
    queryFn,
  })

  const { tasks } = tasksData ?? {}
  const { data, metadata } = tasks ?? {}

  return (
    <Card size="small" variant="borderless" className="tw:h-full">
      <div className="tw:flex tw:flex-col tw:gap-y-4 tw:lg:gap-y-5 tw:md:p-3">
        <div className="tw:grid tw:grid-cols-1 tw:sm:grid-cols-[1fr_auto] tw:lg:grid-cols-[0.7fr_auto] tw:gap-4 tw:items-center">
          <div className="tw:order-2 tw:sm:order-1 tw:flex tw:items-center tw:gap-x-2">
            <SearchInput
              defaultValue={search}
              placeholder="Search tasks by name..."
              onChange={handleSearch}
            />
            <Select
              showSearch
              options={options}
              defaultValue={selectedFilters?.status}
              onChange={(value) => handleSelectChange('status', value)}
              allowClear
              className="tw:sm:w-60"
              placeholder="Select status"
              size="large"
            />
          </div>
          <div className="tw:order-1 tw:justify-self-end tw:sm:order-2">
            <AddTask />
          </div>
        </div>
        <List
          dataSource={data ?? []}
          loading={isLoading}
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 4,
            lg: 4,
            xl: 4,
            xxl: 4,
          }}
          renderItem={(item) => (
            <List.Item className="tw:h-full">
              <Badge.Ribbon color={statusColorMap[item.status]} text={statusTitleMap[item.status]}>
                <Card
                  actions={[
                    <EditTask key="edit-task" taskData={item} />,
                    <DeleteTask key="delete-task" taskId={item.id} />,
                    <UpdateTaskStatus key="update-status" taskData={item} />,
                  ]}
                  title={item.title}
                  className="tw:h-62"
                >
                  <div className="tw:flex tw:flex-col tw:gap-y-1.5 tw:min-h-20">
                    <Typography.Paragraph
                      ellipsis={{
                        rows: 3,
                      }}
                    >
                      {item.description}
                    </Typography.Paragraph>
                  </div>
                </Card>
              </Badge.Ribbon>
            </List.Item>
          )}
          pagination={{
            total: metadata?.total,
            current,
            pageSize,
            onChange: handlePagination,
          }}
        />
      </div>
    </Card>
  )
}
