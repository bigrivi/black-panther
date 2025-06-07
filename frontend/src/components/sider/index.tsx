import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import Paper from "@mui/material/Paper";
import React from "react";

import ChevronLeft from "@mui/icons-material/ChevronLeft";
import Logout from "@mui/icons-material/Logout";

import {
    CanAccess,
    type ITreeMenu,
    useActiveAuthProvider,
    useIsExistAuthentication,
    useLink,
    useLogout,
    useMenu,
    useRouterContext,
    useRouterType,
    useTitle,
    useTranslate,
    useWarnAboutChange,
} from "@refinedev/core";

import {
    RefineThemedLayoutV2SiderProps,
    ThemedTitleV2,
    useThemedLayoutContext,
} from "@refinedev/mui";
import classNames from "classnames";
import { MenuItem, NavMenu, SubMenu } from "mui-nav-menu";
import useStyles from "./styles";

export const AppSider: React.FC<RefineThemedLayoutV2SiderProps> = ({
    Title: TitleFromProps,
    meta,
}) => {
    const {
        siderCollapsed,
        setSiderCollapsed,
        mobileSiderOpen,
        setMobileSiderOpen,
    } = useThemedLayoutContext();

    const drawerWidth = () => {
        if (siderCollapsed) return 77;
        return 240;
    };

    const t = useTranslate();
    const routerType = useRouterType();
    const Link = useLink();
    const { Link: LegacyLink } = useRouterContext();
    const ActiveLink = routerType === "legacy" ? LegacyLink : Link;
    const { classes } = useStyles();

    const { menuItems, selectedKey, defaultOpenKeys } = useMenu({ meta });
    const isExistAuthentication = useIsExistAuthentication();
    const TitleFromContext = useTitle();
    const authProvider = useActiveAuthProvider();
    const { warnWhen, setWarnWhen } = useWarnAboutChange();
    const { mutate: mutateLogout } = useLogout({
        v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
    });
    const RenderToTitle = TitleFromProps ?? TitleFromContext ?? ThemedTitleV2;

    const selectedKeyByPath = selectedKey
        .split("/")
        .filter((item) => item)
        .reduce((prev, item) => {
            return [...prev, [...prev, item].join("/")];
        }, [])
        .map((item) => "/" + item);

    const renderTreeView = (tree: ITreeMenu[], selectedKey?: string) => {
        return tree.map((item: ITreeMenu) => {
            const { icon, route, name, children, parentName, meta } = item;
            if (children.length > 0) {
                return (
                    <CanAccess
                        key={item.key}
                        resource={name}
                        action="list"
                        params={{
                            resource: item,
                        }}
                    >
                        <SubMenu
                            id={item.key!}
                            icon={icon}
                            label={meta?.label!}
                        >
                            {renderTreeView(children, selectedKey)}
                        </SubMenu>
                    </CanAccess>
                );
            }

            return (
                <CanAccess
                    key={item.key}
                    resource={name}
                    action="list"
                    params={{ resource: item }}
                >
                    <MenuItem
                        link={route}
                        id={item.key!}
                        icon={icon}
                        label={meta?.label!}
                    />
                </CanAccess>
            );
        });
    };

    const handleLogout = () => {
        if (warnWhen) {
            const confirm = window.confirm(
                t(
                    "warnWhenUnsavedChanges",
                    "Are you sure you want to leave? You have unsaved changes."
                )
            );

            if (confirm) {
                setWarnWhen(false);
                mutateLogout();
            }
        } else {
            mutateLogout();
        }
    };

    const logout = isExistAuthentication && (
        <MenuItem
            onClick={handleLogout}
            id="logout"
            icon={<Logout />}
            label={t("buttons.logout")}
        />
    );

    const items = renderTreeView(menuItems, selectedKey);

    const renderSider = () => {
        return (
            <div className={classNames(classes.sidebar)}>
                <NavMenu
                    mode="inline"
                    linkComponent={ActiveLink}
                    popperClassName={classes.popup}
                    selectedIds={selectedKeyByPath}
                    defaultOpenIds={defaultOpenKeys}
                    collapsed={siderCollapsed}
                    rootClassName={classes.menu}
                    elevation={10}
                    inlineIndent={{
                        base: 55,
                        step: 20,
                    }}
                >
                    {items}
                    {logout}
                </NavMenu>
            </div>
        );
    };

    const drawer = (
        <List
            disablePadding
            sx={{
                flexGrow: 1,
                paddingTop: "16px",
            }}
        >
            {renderSider()}
        </List>
    );

    return (
        <>
            <Box
                sx={{
                    width: { xs: drawerWidth() },
                    display: {
                        xs: "none",
                        md: "block",
                    },
                    transition: "width 0.3s ease",
                }}
            />
            <Box
                component="nav"
                sx={{
                    position: "fixed",
                    zIndex: 1101,
                    width: { sm: drawerWidth() },
                    display: "flex",
                }}
            >
                <Drawer
                    variant="temporary"
                    elevation={2}
                    open={mobileSiderOpen}
                    onClose={() => setMobileSiderOpen(false)}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: {
                            sm: "block",
                            md: "none",
                        },
                    }}
                >
                    <Box
                        sx={{
                            width: drawerWidth(),
                        }}
                    >
                        <Box
                            sx={{
                                height: 64,
                                display: "flex",
                                alignItems: "center",
                                paddingLeft: "16px",
                                fontSize: "14px",
                            }}
                        >
                            <RenderToTitle collapsed={false} />
                        </Box>
                        {drawer}
                    </Box>
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: "none", md: "block" },
                        "& .MuiDrawer-paper": {
                            width: drawerWidth(),
                            overflow: "hidden",
                            transition:
                                "width 200ms cubic-bezier(0.4, 0, 0.6, 1) 0ms",
                        },
                    }}
                    open
                >
                    <Paper
                        elevation={0}
                        sx={{
                            fontSize: "14px",
                            width: "100%",
                            height: 64,
                            display: "flex",
                            flexShrink: 0,
                            alignItems: "center",
                            justifyContent: siderCollapsed
                                ? "center"
                                : "space-between",
                            paddingLeft: siderCollapsed ? 0 : "16px",
                            paddingRight: siderCollapsed ? 0 : "8px",
                            variant: "outlined",
                            borderRadius: 0,
                            borderBottom: (theme) =>
                                `1px solid ${theme.palette.action.focus}`,
                        }}
                    >
                        <RenderToTitle collapsed={siderCollapsed} />
                        {!siderCollapsed && (
                            <IconButton
                                size="small"
                                onClick={() => setSiderCollapsed(true)}
                            >
                                {<ChevronLeft />}
                            </IconButton>
                        )}
                    </Paper>
                    <Box
                        sx={{
                            flexGrow: 1,
                            overflowX: "hidden",
                            overflowY: "auto",
                        }}
                    >
                        {drawer}
                    </Box>
                </Drawer>
            </Box>
        </>
    );
};
