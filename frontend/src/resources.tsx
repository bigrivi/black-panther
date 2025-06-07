import { Dashboard, Settings } from "@mui/icons-material";
import { ResourceProps } from "@refinedev/core";

export const resources = (t): ResourceProps[] => {
    return [
        {
            name: "dashboard",
            list: "/",
            meta: {
                label: t("menus.dashboard"),
                icon: <Dashboard />,
            },
        },
        {
            name: "system_manager",
            meta: {
                label: t("menus.system"),
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
                label: t("menus.system.user"),
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
                label: t("menus.system.role"),
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
                label: t("menus.system.position"),
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
                label: t("menus.system.department"),
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
                label: t("menus.system.resource"),
                parent: "system_manager",
            },
        },
        {
            name: "policy",
            list: "/policy",
            meta: {
                label: t("menus.system.policy"),
                parent: "system_manager",
            },
        },
        {
            name: "enum",
            list: "/enums",
            create: "/enums/create",
            edit: "/enums/edit/:id",
            meta: {
                label: t("menus.system.enum"),
                parent: "system_manager",
            },
        },
        {
            name: "parameter",
            list: "/parameters",
            create: "/parameters/create",
            edit: "/parameters/edit/:id",
            meta: {
                label: t("menus.system.parameterSetting"),
                parent: "system_manager",
            },
        },
    ];
};
