import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { ClientProvider, NotificationProvider, ThemeProvider } from "@/app/providers";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { DashboardLayout } from "@/app/components";


const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Daily Task Manager",
    template: "%s | Task Manager",
  },
  description: "A task management application with real-time updates",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} antialiased`}
      >
        <AntdRegistry>
          <ThemeProvider>
            <ClientProvider>
              <NotificationProvider>
                <DashboardLayout>
                  {children}
                </DashboardLayout>
              </NotificationProvider>
            </ClientProvider>
          </ThemeProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
