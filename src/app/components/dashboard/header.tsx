'use client'
import {
  Avatar,
  Divider,
  Dropdown,
  Layout,
  MenuProps,
  theme,
  Typography,
} from "antd";
import React from "react";

import { EditOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { SearchInput } from "@/app/components";
import { cleanup, useAuthStore } from "@/app/lib";
import { useRouter } from "next/navigation";

export function DashboardHeader() {
  const { token } = theme.useToken();
  const { logout } = useAuthStore();
  const { replace } = useRouter();

  const { Header } = Layout;
  const { Text } = Typography;

  const headerStyle: React.CSSProperties = {
    position: "sticky",
    top: 0,
    zIndex: 1,
    width: "100%",
    display: "flex",
    alignItems: "center",
    backgroundColor: token.colorBgContainer,
    borderColor: token.colorBorder,
  };

  const menuStyle: React.CSSProperties = {
    boxShadow: "none",
  };

  const contentStyle: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    borderRadius: token.borderRadiusLG,
    boxShadow: token.boxShadowSecondary,
    minWidth: 260,
  };

  const items: MenuProps["items"] = [
    {
      key: "profile",
      label: "Profile",
      icon: <UserOutlined />,
    },
    {
      key: "edit-profile",
      label: "Edit Profile",
      icon: <EditOutlined />,
    },
    {
      key: "logout",
      label: "Logout",
      icon: <LogoutOutlined />,
    },
  ];

  const handleLogout = async () => {
    await cleanup();
    logout();
    replace("/auth/signin");
  };

  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "logout") {
      handleLogout();
    }
  };

  return (
    <Header
      style={headerStyle}
      className="tw:!px-3 tw:md:!px-4 tw:lg:!px-6 tw:xl:!px-7 tw:!border-b-1"
    >
      <div className="tw:flex tw:items-center tw:justify-between tw:gap-x-4 tw:w-full">
        <div className="tw:w-1/4">
          <SearchInput variant="borderless" placeholder="Search..." />
        </div>
        <div className="tw:flex tw:items-center tw:gap-x-2">
          <Dropdown
            arrow
            menu={{ items, onClick: handleMenuClick }}
            trigger={["click"]}
            placement="bottomRight"
            popupRender={(menu) => (
              <div style={contentStyle}>
                <>
                  <div className="tw:flex tw:flex-col tw:items-center tw:justify-center tw:p-4 tw:gap-y-1">
                    <Avatar size="large">M</Avatar>
                    <Text>Muhammad Waseem</Text>
                    <Text type="secondary">waseem16140030@gmail.com</Text>
                  </div>
                  <Divider
                    style={{
                      margin: 0,
                    }}
                  />
                  {React.cloneElement(
                    menu as React.ReactElement<{
                      style: React.CSSProperties;
                    }>,
                    { style: menuStyle }
                  )}
                </>
              </div>
            )}
          >
            <Avatar
              icon={<UserOutlined />}
              size={32}
              className="tw:cursor-pointer"
            >
              Muhammad Waseem
            </Avatar>
          </Dropdown>
        </div>
      </div>
    </Header>
  );
}
