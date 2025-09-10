import { Input, InputProps, Typography } from 'antd'
import clsx from 'clsx'

export interface TMPasswordProps extends InputProps {
  label?: string
}
export function TMPassword({
  label,
  name,
  size = 'middle',
  className,
  ...restProps
}: TMPasswordProps) {
  const { Password } = Input
  const { Text } = Typography
  return (
    <div>
      <div className="tw:flex tw:flex-col tw:gap-y-1">
        {label && (
          <label htmlFor={name}>
            <Text>{label}</Text>
          </label>
        )}
        <Password
          id={name}
          name={name}
          size={size}
          className={clsx(className)}
          {...restProps}
        />
      </div>
    </div>
  )
}
