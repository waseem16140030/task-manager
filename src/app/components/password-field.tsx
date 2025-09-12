'use client'
import { Controller, useFormContext } from 'react-hook-form'
import { Typography } from 'antd'
import { TMPassword, TMPasswordProps } from '.'

export interface PasswordFieldProps extends TMPasswordProps {
  name: string
}
export function PasswordField({ name, ...restProps }: PasswordFieldProps) {
  const { control } = useFormContext()
  const { Text } = Typography

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="tw:flex tw:flex-col tw:gap-y-1">
          <TMPassword {...restProps} {...field} status={error ? 'error' : undefined} />
          {error && (
            <Text type="danger" className="tw:!text-sm">
              {error.message}
            </Text>
          )}
        </div>
      )}
    />
  )
}
