'use client'
import { Input, InputProps, Typography } from 'antd'
import clsx from 'clsx'

export interface TMInputProps extends InputProps {
  label?: string
}

export function TMInput({ label, name, size = 'middle', className, ...restProps }: TMInputProps) {
  const { Text } = Typography
  return (
    <div>
      <div className="tw:flex tw:flex-col tw:gap-y-1">
        {label && (
          <label htmlFor={name}>
            <Text>{label}</Text>
          </label>
        )}
        <Input className={clsx(className)} id={name} name={name} size={size} {...restProps} />
      </div>
    </div>
  )
}
