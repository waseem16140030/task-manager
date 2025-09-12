import { UsersHeader, UsersList } from '@/app/features'
import { dehydrate, QueryClient } from '@tanstack/react-query'
import { Skeleton } from 'antd'
import { Suspense } from 'react'
import { Hydrate } from './providers'
import { useGetUsersQuery } from '@/graphql/generated/graphql'

export default async function UserManagement() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: useGetUsersQuery.getKey(),
    queryFn: useGetUsersQuery.fetcher(),
  })

  const dehydratedState = dehydrate(queryClient)

  return (
    <div className="tw:flex tw:flex-col tw:gap-y-3 tw:md:gap-y-4 tw:lg:gap-y-6">
      <UsersHeader />
      <Suspense
        fallback={
          <Skeleton
            active
            avatar
            paragraph={{
              rows: 10,
            }}
          />
        }
      >
        <Hydrate state={dehydratedState}>
          <UsersList />
        </Hydrate>
      </Suspense>
    </div>
  )
}
