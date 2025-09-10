'use client'
import { Card, Divider, Typography } from 'antd'
import { SignInForm } from '.'

export function SignInWrapper() {
  const { Title, Text } = Typography
  return (
    <div className="tw:w-full tw:max-w-xl tw:p-6">
      <Card>
        <div className="tw:p-2 tw:md:p-3">
          <Title level={3}>Welcome to TM</Title>
          <Text type="secondary">Your Daily Task Manager</Text>
          <div className="tw:py-2 tw:sm:py-3 tw:md:py-4 tw:lg:py-6">
            <Divider>sign in with TM</Divider>
          </div>
          <SignInForm />
        </div>
      </Card>
    </div>
  )
}
