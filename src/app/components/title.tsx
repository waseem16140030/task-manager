'use client'
import { Typography } from 'antd'
import { TitleProps } from 'antd/es/typography/Title'
export interface TMTitleProps extends TitleProps {
  className?: string
}
export function TMTitle({ className, ...restProps }: TMTitleProps) {
  const { Title } = Typography
  return <Title className={`${className} tw:!mb-0 tw:leading-normal`} {...restProps} />
}
