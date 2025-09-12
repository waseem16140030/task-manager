import { Tag, TagProps } from 'antd'
import clsx from 'clsx'

export const tagSizes = {
  SMALL: 'small',
  DEFAULT: 'default',
  LARGE: 'large',
} as const

type TagSize = keyof typeof tagSizes
type TagSizeType = (typeof tagSizes)[TagSize]

export interface TMTagProps extends TagProps {
  size?: TagSizeType
  block?: boolean
}

const tagSizeClasses = {
  [tagSizes.SMALL]: 'tw:!px-2.5 tw:!py-[1.5px] tw:!text-center tw:!font-display',
  [tagSizes.DEFAULT]: 'tw:!px-3.5 tw:!py-1 tw:!text-sm tw:!text-center',
  [tagSizes.LARGE]: 'tw:!px-3.5 tw:!py-1 tw:!text-sm tw:!text-center tw:!font-display',
}

export function TMTag({ className, size = 'default', block, ...restProps }: TMTagProps) {
  const tagSize = tagSizeClasses[size]
  const blockClass = block ? 'tw:!w-full' : 'tw:w-auto'
  return (
    <Tag
      className={clsx('tw:[.ant-tag]:!m-0', 'tw:truncate', tagSize, blockClass, className)}
      {...restProps}
    />
  )
}
