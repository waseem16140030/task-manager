'use client'
import { Input, Typography } from 'antd'
import { TextAreaProps } from 'antd/es/input'
import { clsx } from 'clsx'

export interface TMTextAreaProps extends TextAreaProps {
  label?: string
}
export function TMTextArea({ label, name, className, ...restProps }: TMTextAreaProps) {
  const { TextArea } = Input
  const { Text } = Typography
  return (
    <div className="tw:flex tw:flex-col tw:gap-y-1">
      {label && (
        <label htmlFor={name}>
          <Text>{label}</Text>
        </label>
      )}
      <TextArea id={name} name={name} className={clsx(className)} {...restProps} />
    </div>
  )
}
