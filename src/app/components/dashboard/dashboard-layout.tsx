'use client'
import '@ant-design/v5-patch-for-react-19'
import React, { useEffect } from 'react'
import { Layout } from 'antd'
import { DashboardContent, DashboardFooter, DashboardHeader, DashboardSidebar } from '.'
import { usePathname } from 'next/navigation'
import { SessionProvider } from 'next-auth/react'

export interface DashboardLayoutProps {
  children: React.ReactNode
}
export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const pathname = usePathname()
  const isAuth = pathname.includes('/auth')

  if (isAuth) return <Layout style={{ minHeight: '100vh' }}>{children}</Layout>

  return (
    <SessionProvider>
      <Layout hasSider>
        <DashboardSidebar />
        <Layout>
          <DashboardHeader />
          <DashboardContent>{children}</DashboardContent>
          <DashboardFooter />
        </Layout>
      </Layout>
    </SessionProvider>
  )
}
