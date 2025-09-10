import { UsersHeader, UsersList } from "@/app/features";

export default async function UserManagement() {
  return <div className="tw:flex tw:flex-col tw:gap-y-3 tw:md:gap-y-4 tw:lg:gap-y-6">
    <UsersHeader />
    <UsersList />
  </div>
}