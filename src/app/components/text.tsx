'use client'
import { theme, Typography } from 'antd'
import { TextProps } from 'antd/es/typography/Text'
import clsx from 'clsx'

export const textSizes = {
  XS: 'xs',
  SM: 'sm',
  BASE: 'base',
  LG: 'lg',
  XL: 'xl',
  '2XL': '2xl',
} as const

type TextSize = keyof typeof textSizes
type TextSizeType = (typeof textSizes)[TextSize]

type BaseTextColor = NonNullable<TextProps['type']>
type TextColor = BaseTextColor | 'light' | 'info'

export interface TMTextProps extends Omit<TextProps, 'type'> {
  className?: string
  size?: TextSizeType
  type?: TextColor
  truncate?: boolean
}

const textSizeClasses = {
  [textSizes.XS]: 'tw:!text-xs',
  [textSizes.SM]: 'tw:!text-sm',
  [textSizes.BASE]: 'tw:!text-base',
  [textSizes.LG]: 'tw:!text-lg',
  [textSizes.XL]: 'tw:!text-xl',
  [textSizes['2XL']]: 'tw:!text-2xl',
}

export function TMText({ className, type, size = 'sm', truncate, ...restProps }: TMTextProps) {
  const { Text } = Typography
  const { token } = theme.useToken()

  const mapTextColor: Record<TextColor, string> = {
    secondary: token.colorTextSecondary,
    warning: token.colorWarning,
    danger: token.colorError,
    success: token.colorSuccess,
    light: token.colorTextTertiary,
    info: token.colorInfo,
  }

  const customColor = type ? mapTextColor[type] : undefined
  const textClass = textSizeClasses[size]

  const antDType = ['secondary', 'success', 'warning', 'danger'].includes(type ?? '')
    ? (type as BaseTextColor)
    : undefined

  const truncateClass = truncate ? 'tw:!truncate tw:text-ellipsis' : ''

  return (
    <Text
      className={clsx('tw:!mb-0', textClass, truncateClass, className)}
      type={antDType}
      {...restProps}
      style={{ color: customColor, ...restProps.style }}
    />
  )
}
