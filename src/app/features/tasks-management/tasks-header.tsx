import { TMText, TMTitle } from "@/app/components";

export function TasksHeader() {
  return (
    <div>
      <TMTitle className="tw:!font-medium tw:!text-xl" level={3}>
        Tasks Management
      </TMTitle>
      <TMText className="tw:!text-sm" type="secondary">
        Manage and view user daily tasks.
      </TMText>
    </div>
  );
}
