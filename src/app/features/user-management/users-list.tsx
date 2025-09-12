'use client'
import { SearchInput, TMTag, TMText } from '@/app/components'
import {
  formatDate,
  usePaginatedQueryParams,
  userRoleColorMap,
  userRoleIconMap,
  userStatusColorMap,
  useUserOptions,
} from '@/app/shared/utils'
import { useGetUsersQuery, User } from '@/graphql/generated/graphql'
import { Avatar, Card, Select, Space, Table, TableProps, Tooltip } from 'antd'
import { capitalize } from 'lodash'
import { useQuery } from '@tanstack/react-query'
import { AddUser, DeleteUser, EditUser } from '.'
import React from 'react'

export function UsersList() {
  const {
    handleSearch,
    onTableChange,
    handleSelectChange,
    search,
    current,
    pageSize,
    selectedFilters,
    sortField,
    sortOrder,
  } = usePaginatedQueryParams({ filterKeys: ['role'] })

  const { roles } = useUserOptions()

  const queryKey = useGetUsersQuery.getKey({
    pagination: { page: current, pageSize },
    filters: { role: selectedFilters.role, email: search },
    sort: { field: sortField, order: sortOrder },
  })
  const queryFn = useGetUsersQuery.fetcher({
    pagination: { page: current, pageSize },
    filters: { role: selectedFilters.role, email: search },
    sort: { field: sortField, order: sortOrder },
  })
  const { data: userData, isLoading } = useQuery({
    queryKey,
    queryFn,
  })

  //data
  const { users } = userData ?? {}
  const { data, metadata } = users ?? {}

  const userColumns: TableProps<User>['columns'] = [
    {
      key: 'name',
      dataIndex: 'name',
      title: 'Name',
      sorter: true,
      render: (_, { name }, index) => (
        <Space size={4}>
          <Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />
          <TMText>{name}</TMText>
        </Space>
      ),
    },
    {
      key: 'email',
      dataIndex: 'email',
      title: 'Email',
    },
    {
      key: 'phone',
      dataIndex: 'phone',
      title: 'Phone',
    },
    {
      key: 'country',
      dataIndex: 'country',
      title: 'Country',
    },
    {
      key: 'registrationDate',
      dataIndex: 'registrationDate',
      title: 'Registration Date',
      sorter: true,
      render: (_, { registrationDate }) => (
        <Tooltip title={registrationDate}>{formatDate(registrationDate ?? '')}</Tooltip>
      ),
    },
    {
      key: 'role',
      dataIndex: 'role',
      title: 'Role',
      align: 'center',
      render: (_, { role }) => {
        const icon = React.createElement(userRoleIconMap[role!])
        const color = userRoleColorMap[role!]
        return (
          <TMTag className="tw:!m-0" color={color} icon={icon}>
            {capitalize(role ?? '')}
          </TMTag>
        )
      },
    },
    {
      key: 'status',
      dataIndex: 'status',
      title: 'Status',
      align: 'center',
      render: (_, { status }) => {
        const color = userStatusColorMap[status!] ?? 'default'
        return (
          <TMTag className="tw:!m-0" color={color}>
            {capitalize(status ?? '')}
          </TMTag>
        )
      },
    },
    {
      title: 'Actions',
      dataIndex: 'id',
      key: 'actions',
      align: 'center',
      render: (_, user) => (
        <div className="tw:flex tw:items-center tw:justify-center tw:gap-x-1.5 tw:flex-shrink-0">
          <EditUser userData={user} />
          <DeleteUser userId={user.id} />
        </div>
      ),
    },
  ]

  return (
    <Card size="small" variant="borderless" className="tw:h-full">
      <div className="tw:flex tw:flex-col tw:gap-y-4 tw:lg:gap-y-5 tw:md:p-3">
        <div className="tw:grid tw:grid-cols-1 tw:sm:grid-cols-[1fr_auto] tw:lg:grid-cols-[0.7fr_auto] tw:gap-4 tw:items-center">
          <div className="tw:order-2 tw:sm:order-1 tw:flex tw:items-center tw:gap-x-2">
            <SearchInput
              defaultValue={search}
              placeholder="Search users by email..."
              onChange={handleSearch}
            />
            <Select
              options={roles}
              defaultValue={selectedFilters?.role}
              onChange={(value) => handleSelectChange('role', value)}
              allowClear
              className="tw:sm:w-60"
              placeholder="Select role"
              size="large"
            />
          </div>
          <div className="tw:order-1 tw:justify-self-end tw:sm:order-2">
            <AddUser />
          </div>
        </div>
        <Table
          onChange={onTableChange}
          loading={isLoading}
          columns={userColumns}
          dataSource={data ?? []}
          rowKey="id"
          pagination={{
            total: metadata?.total,
            pageSize,
            current,
          }}
          scroll={{ x: 'max-content' }}
        />
      </div>
    </Card>
  )
}
