'use client'
import { TMText, TMTitle } from "@/app/components"

export function UsersHeader() {
  return (
    <div>
      <TMTitle className="tw:!font-medium tw:!text-xl" level={3}>
        User Management
      </TMTitle>
      <TMText className="tw:!text-sm" type="secondary">
        Manage and view user profiles.
      </TMText>
    </div>
  )
}
