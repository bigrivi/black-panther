import {
    DashboardOutlined,
    SettingOutlined,
    TagsOutlined,
    TeamOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { ResourceProps } from "@refinedev/core";

export const resources: ResourceProps[] = [
    {
        name: "dashboard",
        list: "/",
        meta: {
            label: "Dashboard",
            icon: <DashboardOutlined />,
        },
    },
    {
        name: "system_manager",
        meta: {
            icon: <SettingOutlined />,
            label: "System",
        },
    },
    {
        name: "user",
        list: "/users",
        create: "/users/create",
        edit: "/users/edit/:id",
        show: "/users/show/:id",
        meta: {
            canDelete: true,
            label: "User",
            icon: <TagsOutlined />,
            parent: "system_manager",
        },
    },
    {
        name: "role",
        list: "/roles",
        create: "/roles/create",
        edit: "/roles/edit/:id",
        show: "/roles/show/:id",
        meta: {
            canDelete: true,
            icon: <UserOutlined />,
            label: "Role",
            parent: "system_manager",
        },
    },
    {
        name: "department",
        list: "/departments",
        create: "/departments/create",
        edit: "/departments/edit/:id",
        show: "/departments/show/:id",
        meta: {
            canDelete: true,
            icon: <TeamOutlined />,
            label: "Department",
            parent: "system_manager",
        },
    },
    {
        name: "resource",
        list: "/resources",
        create: "/resources/create",
        edit: "/resources/edit/:id",
        show: "/resources/show/:id",
        meta: {
            canDelete: true,
            icon: <TeamOutlined />,
            label: "Resource",
            parent: "system_manager",
        },
    },
    {
        name: "policy",
        list: "/policy",
        meta: {
            label: "Policy",
            icon: <DashboardOutlined />,
            parent: "system_manager",
        },
    },
];
