'use client'
import { Controller, useFormContext } from 'react-hook-form'
import { Typography } from 'antd'
import { TMInput, TMInputProps } from '.'

export interface CFInputFieldProps extends TMInputProps {
  name: string
}
export function InputField({ name, ...restProps }: CFInputFieldProps) {
  const { control } = useFormContext()
  const { Text } = Typography

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="tw:flex tw:flex-col tw:gap-y-1">
          <TMInput {...restProps} {...field} status={error ? 'error' : undefined} />
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
