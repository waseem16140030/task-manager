'use client'
import { SearchInput, TMText } from '@/app/components'
import { formatDate, usePaginatedQueryParams } from '@/app/shared/utils'
import { Badge, Card, Divider, List, Select, Space, Typography } from 'antd'
import { AddTask, DeleteTask, EditTask, UpdateTaskStatus } from '.'
import { useQuery } from '@tanstack/react-query'
import { useGetTasksQuery, useGetUsersConfigQuery } from '@/graphql/generated/graphql'
import {
  statusColorMap,
  statusTitleMap,
  useTaskStatusOptions,
} from '@/app/shared/utils/hooks/useTasks'
import { CalendarOutlined, FormOutlined } from '@ant-design/icons'

export function TasksList() {
  const {
    handleSearch,
    handlePagination,
    handleSelectChange,
    search,
    current,
    pageSize,
    selectedFilters,
  } = usePaginatedQueryParams({
    filterKeys: ['status', 'assignee'],
    defaultValues: {
      pageSize: 8,
    },
  })
  const options = useTaskStatusOptions()

  const { data: activeUsers } = useQuery({
    queryKey: useGetUsersConfigQuery.getKey(),
    queryFn: useGetUsersConfigQuery.fetcher(),
  })

  const queryKey = useGetTasksQuery.getKey({
    filters: {
      search,
      status: selectedFilters?.status,
      assignee: selectedFilters?.assignee,
    },
    pagination: {
      page: current,
      pageSize,
    },
  })
  const queryFn = useGetTasksQuery.fetcher({
    filters: {
      search,
      status: selectedFilters.status,
      assignee: selectedFilters?.assignee,
    },
    pagination: {
      page: current,
      pageSize,
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
        <div className="tw:grid tw:grid-cols-1 tw:md:grid-cols-[1fr_auto] tw:lg:grid-cols-[0.7fr_auto] tw:gap-4 tw:items-center">
          <div className="tw:order-2 tw:sm:order-1 tw:flex tw:items-center tw:gap-2 tw:flex-wrap tw:md:flex-nowrap">
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
            <Select
              options={activeUsers?.usersConfig}
              fieldNames={{
                value: 'id',
                label: 'name',
              }}
              defaultValue={selectedFilters?.assignee}
              onChange={(value) => handleSelectChange('assignee', value)}
              showSearch
              allowClear
              className="tw:sm:w-60"
              placeholder="Select Assignee"
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
                  className="tw:h-85"
                >
                  <div className="tw:flex tw:flex-col tw:gap-y-1.5 tw:min-h-20">
                    <Typography.Paragraph
                      ellipsis={{
                        rows: 2,
                      }}
                    >
                      {item.description}
                    </Typography.Paragraph>
                    <div className="tw:flex tw:items-center tw:gap-x-1.5 tw:min-w-0 tw:flex-shrink-0">
                      <CalendarOutlined />
                      <TMText className="tw:truncate">{formatDate(item.createdAt)}</TMText>
                    </div>
                    <div className="tw:flex tw:items-center tw:gap-x-1.5 tw:min-w-0 tw:flex-shrink-0">
                      <FormOutlined />
                      <TMText className="tw:truncate">{formatDate(item.updatedAt)}</TMText>
                    </div>
                    {item.assignee && (
                      <>
                        <Divider
                          style={{
                            marginBlock: 4,
                          }}
                        />
                        <div className="tw:flex tw:flex-col tw:gap-y-1 tw:min-w-0">
                          <div className="tw:flex tw:items-center tw:gap-x-1.5 tw:flex-shrink-0 tw:min-w-0">
                            <TMText className="tw:truncate" type="secondary" size="sm">
                              Name:
                            </TMText>
                            <TMText className="tw:truncate" size="sm">
                              {item.assignee?.name}
                            </TMText>
                          </div>
                          <div className="tw:flex tw:items-center tw:gap-x-1.5 tw:flex-shrink-0 tw:min-w-0">
                            <TMText className="tw:truncate" type="secondary" size="sm">
                              Email:
                            </TMText>
                            <TMText className="tw:truncate" size="sm">
                              {item.assignee?.email}
                            </TMText>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </Card>
              </Badge.Ribbon>
            </List.Item>
          )}
          pagination={{
            total: metadata?.total,
            current: current ?? 1,
            pageSize,
            onChange: handlePagination,
          }}
        />
      </div>
    </Card>
  )
}
