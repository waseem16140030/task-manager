import { TasksHeader, TasksList } from "@/app/features";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { useGetTasksQuery } from "@/graphql/generated/graphql";
import { Suspense } from "react";
import { Skeleton } from "antd";
import { Hydrate } from "@/app/providers";

export default async function TasksManagement() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: useGetTasksQuery.getKey(),
    queryFn: useGetTasksQuery.fetcher(),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <div className="tw:flex tw:flex-col tw:gap-y-3 tw:md:gap-y-4 tw:lg:gap-y-6">
      <TasksHeader />
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
          <TasksList />
        </Hydrate>
      </Suspense>
    </div>
  );
}
