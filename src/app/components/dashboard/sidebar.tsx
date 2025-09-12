"use client";
import { Layout, Menu, MenuProps, theme } from "antd";
import React, { useMemo } from "react";
import {
  BarChartOutlined,
  BellOutlined,
  CreditCardOutlined,
  MessageOutlined,
  NotificationOutlined,
  ScheduleOutlined,
  SecurityScanOutlined,
  SettingOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { routeKey } from "@/app/config";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import logoImg from '@root/public/logo.png'
import { useSession } from "next-auth/react";

export function DashboardSidebar() {
  const pathname = usePathname();
  const { push } = useRouter();
  const { token } = theme.useToken();
  const { Sider } = Layout;
  const { data: session } = useSession();
  const role = session?.user?.role 

  const siderStyle: React.CSSProperties = {
    insetInlineStart: 0,
    scrollbarWidth: "thin",
    scrollbarGutter: "stable",
    backgroundColor: token.colorBgContainer,
    borderColor: token.colorBorder,
  };

 const items: MenuProps["items"] = useMemo(() => {
    const baseItems: MenuProps["items"] = [
      {
        key: routeKey.TASKS,
        label: "Tasks Management",
        icon: <ScheduleOutlined />,
      },
      {
        key: routeKey.PUSH_NOTIFICATIONS,
        label: "Push Notifications",
        icon: <BellOutlined />,
      },
      {
        key: routeKey.EMAIL_SYSTEM,
        label: "Email System",
        icon: <MessageOutlined />,
      },
      {
        key: routeKey.SUBSCRIPTIONS,
        label: "Subscriptions",
        icon: <CreditCardOutlined />,
      },
      {
        key: routeKey.TEAM_ACCESS,
        label: "Team Access",
        icon: <SecurityScanOutlined />,
      },
      {
        key: routeKey.ANALYTICS,
        label: "Analytics",
        icon: <BarChartOutlined />,
      },
      {
        key: routeKey.USER_SUPPORT,
        label: "User Support",
        icon: <NotificationOutlined />,
      },
      {
        key: routeKey.SETTINGS,
        label: "Settings",
        icon: <SettingOutlined />,
      },
    ];

    if (role !== "user") {
      baseItems.unshift({
        key: routeKey.USERS_MANAGEMENT,
        label: "User Management",
        icon: <UsergroupAddOutlined />,
      });
    }

    return baseItems;
  }, [role]);

  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    push(key);
  };

  return (
    <Sider
      width={250}
      breakpoint="lg"
      style={siderStyle}
      className="tw:overflow-auto tw:h-screen tw:!sticky tw:top-0 tw:bottom-0 tw:!border-r-1"
    >
      <div
        className="tw:h-[72px] tw:flex tw:items-center tw:px-6 tw:mb-2 tw:lg:mb-4 tw:border-b-1"
        style={{
          borderColor: token.colorBorder,
        }}
      >
        <Link href={routeKey.USERS_MANAGEMENT}>
          <Image src={logoImg} alt="Task Manager Icon" height={60} width={120} className="tw:max-w-full" priority={false} />
        </Link>
      </div>
      <Menu
        className="tw:!border-0"
        selectedKeys={[pathname]}
        onClick={handleMenuClick}
        mode="inline"
        defaultSelectedKeys={[routeKey.USERS_MANAGEMENT]}
        items={items}
      />
    </Sider>
  );
}
