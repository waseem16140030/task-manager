'use client'
import { ConfigProvider } from 'antd'
import { defaultTheme } from '@/app/shared/lib'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <ConfigProvider theme={defaultTheme}>{children}</ConfigProvider>
}
