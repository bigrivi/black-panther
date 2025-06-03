import { Dashboard, Settings } from "@mui/icons-material";
import { ResourceProps } from "@refinedev/core";

export const resources: ResourceProps[] = [
    {
        name: "dashboard",
        list: "/",
        meta: {
            label: "Dashboard",
            icon: <Dashboard />,
        },
    },
    {
        name: "system_manager",
        meta: {
            label: "System",
            icon: <Settings />,
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
            label: "Role",
            parent: "system_manager",
        },
    },
    {
        name: "position",
        list: "/positions",
        create: "/positions/create",
        edit: "/positions/edit/:id",
        show: "/positions/show/:id",
        meta: {
            canDelete: true,
            label: "Position",
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
            label: "Resource",
            parent: "system_manager",
        },
    },
    {
        name: "policy",
        list: "/policy",
        meta: {
            label: "Policy",
            parent: "system_manager",
        },
    },
    {
        name: "enum",
        list: "/enums",
        create: "/enums/create",
        edit: "/enums/edit/:id",
        meta: {
            label: "Enum",
            parent: "system_manager",
        },
    },
    {
        name: "parameter",
        list: "/parameters",
        create: "/parameters/create",
        edit: "/parameters/edit/:id",
        meta: {
            label: "Parameter Setting",
            parent: "system_manager",
        },
    },
];
