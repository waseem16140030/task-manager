'use client'

import { InputField, SelectField } from "@/app/components";
import { useUserOptions } from "@/app/shared/utils";


export function AddUserForm() {
  const { roles, countries, statuses } = useUserOptions();
  return (
    <div
      className="tw:flex tw:flex-col tw:gap-y-5 tw:!my-4"
    >
      <InputField name="name" label="Name" placeholder="Enter your name" />
      <InputField name="email" label="Email" placeholder="Enter your email" />
      <InputField name="phone" label="Phone" placeholder="Enter your phone" />
      <SelectField
        name="country"
        label="Country"
        placeholder="Select country"
        options={countries}
      />
      <SelectField
        name="role"
        label="Role"
        placeholder="Select role"
        options={roles}
      />
      <SelectField
        name="status"
        label="Status"
        placeholder="Select status"
        options={statuses}
      />
    </div>
  );
}
