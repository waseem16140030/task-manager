import { SelectProps } from "antd";
import { useMemo } from "react";

export function useUserOptions(): {
  roles: SelectProps["options"];
  countries: SelectProps["options"];
  statuses: SelectProps["options"];
} {
  const roles = useMemo<SelectProps["options"]>(
    () => [
      { label: "Admin", value: "admin" },
      { label: "User", value: "user" },
    ],
    []
  );

  const countries = useMemo<SelectProps["options"]>(
    () => [
      { label: "Pakistan", value: "Pakistan" },
      { label: "USA", value: "USA" },
      { label: "UK", value: "UK" },
      { label: "Canada", value: "Canada" },
      { label: "Germany", value: "Germany" },
    ],
    []
  );

  const statuses = useMemo<SelectProps["options"]>(
    () => [
      { label: "Active", value: "active" },
      { label: "InActive", value: "inactive" },
      { label: "Pending", value: "pending" },
    ],
    []
  );

  return {
    roles,
    countries,
    statuses,
  };
}
