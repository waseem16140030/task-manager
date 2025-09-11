"use client";

import { Controller, useFormContext } from "react-hook-form";
import { TMTextArea, TMTextAreaProps } from ".";
import { Typography } from "antd";

export interface TextAreaFieldProps extends TMTextAreaProps {
  name: string;
}
export function TextAreaField({ name, ...restProps }: TextAreaFieldProps) {
  const { control } = useFormContext();
  const { Text } = Typography;
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="tw:flex tw:flex-col tw:gap-y-1">
          <TMTextArea
            {...restProps}
            {...field}
            status={error ? "error" : undefined}
          />
          {error && (
            <Text type="danger" className="tw:!text-sm">
              {error.message}
            </Text>
          )}
        </div>
      )}
    />
  );
}
