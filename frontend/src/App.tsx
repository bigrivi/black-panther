import { Authenticated, CanAccess, HttpError, Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import axios from "axios";
import { useTranslation } from "react-i18next";
import {
    ThemedLayoutV2,
    ThemedSiderV2,
    useNotificationProvider,
} from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";

import routerBindings, {
    CatchAllNavigate,
    DocumentTitleHandler,
    NavigateToResource,
    UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { App as AntdApp } from "antd";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import { Header, PageLoading, AccessDenied, NotFound } from "./components";
import { ColorModeContextProvider } from "./contexts/color-mode";
import { UserCreate, UserEdit, UserList, UserShow } from "./pages/users";
import { RoleCreate, RoleEdit, RoleList, RoleShow } from "./pages/roles";
import { ForgotPassword } from "./pages/forgotPassword";
import { Login } from "@/pages/login";
import { Register } from "@/pages/register";
import dataProvider from "@/dataProvider";
import { resources } from "@/resources";
import { TOKEN_KEY } from "@/constants";
import { useAuthProvider } from "@/hooks/useAuthProvider";
import { useAccessControlProvider } from "@/hooks/useAccessControlProvider";
import {
    DepartmentCreate,
    DepartmentEdit,
    DepartmentList,
    DepartmentShow,
} from "@/pages/departments";
import {
    ResourceCreate,
    ResourceEdit,
    ResourceList,
    ResourceShow,
} from "./pages/resource";
import "./App.css";
import { DashboardPage } from "./pages/dashboard";

const axiosInstance = axios.create();
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token && config.headers) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
});

axiosInstance.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        const customError: HttpError = {
            ...error,
            errors: error.response?.data?.errors,
            message: error.response?.data?.message,
            statusCode: error.response?.status,
        };

        return Promise.reject(customError);
    }
);

const App: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { authProvider, user } = useAuthProvider(axiosInstance);
    const { accessControlProvider } = useAccessControlProvider(user);
    const i18nProvider = {
        translate: (key: string, params: object) => t(key, params),
        changeLocale: (lang: string) => i18n.changeLanguage(lang),
        getLocale: () => i18n.language,
    };

    return (
        <BrowserRouter>
            <RefineKbarProvider>
                <ColorModeContextProvider>
                    <AntdApp>
                        <Refine
                            i18nProvider={i18nProvider}
                            accessControlProvider={accessControlProvider}
                            dataProvider={dataProvider(axiosInstance)}
                            notificationProvider={useNotificationProvider}
                            routerProvider={routerBindings}
                            authProvider={authProvider}
                            resources={resources}
                            options={{
                                syncWithLocation: true,
                                warnWhenUnsavedChanges: true,
                                useNewQueryKeys: true,
                                title: {
                                    text: "Photinia",
                                },
                            }}
                        >
                            <Routes>
                                <Route
                                    element={
                                        <Authenticated
                                            key="authenticated-inner"
                                            loading={<PageLoading />}
                                            fallback={
                                                <CatchAllNavigate to="/login" />
                                            }
                                        >
                                            <CanAccess
                                                action="list"
                                                onUnauthorized={({
                                                    resource,
                                                    reason,
                                                    action,
                                                    params,
                                                }) => {
                                                    console.log(params);
                                                    console.warn(
                                                        `You cannot access ${resource}-${params} resource with ${action} action because ${reason}`
                                                    );
                                                }}
                                                fallback={<AccessDenied />}
                                            >
                                                <ThemedLayoutV2
                                                    Header={Header}
                                                    Sider={(props) => (
                                                        <ThemedSiderV2
                                                            {...props}
                                                            fixed
                                                        />
                                                    )}
                                                >
                                                    <Outlet />
                                                </ThemedLayoutV2>
                                            </CanAccess>
                                        </Authenticated>
                                    }
                                >
                                    <Route index element={<DashboardPage />} />

                                    {/* <Route path="/:resource">
                                        <Route
                                            index
                                            element={<BlogPostList />}
                                        />
                                        <Route
                                            path="create"
                                            element={<BlogPostCreate />}
                                        />
                                        <Route
                                            path="edit/:id"
                                            element={<BlogPostEdit />}
                                        />
                                        <Route
                                            path="show/:id"
                                            element={<BlogPostShow />}
                                        />
                                    </Route> */}
                                    <Route path="/users">
                                        <Route index element={<UserList />} />
                                        <Route
                                            path="create"
                                            element={<UserCreate />}
                                        />
                                        <Route
                                            path="edit/:id"
                                            element={<UserEdit />}
                                        />
                                        <Route
                                            path="show/:id"
                                            element={<UserShow />}
                                        />
                                    </Route>
                                    <Route path="/roles">
                                        <Route index element={<RoleList />} />
                                        <Route
                                            path="create"
                                            element={<RoleCreate />}
                                        />
                                        <Route
                                            path="edit/:id"
                                            element={<RoleEdit />}
                                        />
                                        <Route
                                            path="show/:id"
                                            element={<RoleShow />}
                                        />
                                    </Route>
                                    <Route path="/departments">
                                        <Route
                                            index
                                            element={<DepartmentList />}
                                        />
                                        <Route
                                            path="create"
                                            element={<DepartmentCreate />}
                                        />
                                        <Route
                                            path="edit/:id"
                                            element={<DepartmentEdit />}
                                        />
                                        <Route
                                            path="show/:id"
                                            element={<DepartmentShow />}
                                        />
                                    </Route>

                                    <Route
                                        path="/resources"
                                        element={
                                            <ResourceList>
                                                <Outlet />
                                            </ResourceList>
                                        }
                                    >
                                        <Route
                                            path="create"
                                            element={<ResourceCreate />}
                                        />
                                        <Route
                                            path="edit/:id"
                                            element={<ResourceEdit />}
                                        />
                                        <Route
                                            path="show/:id"
                                            element={<ResourceShow />}
                                        />
                                    </Route>

                                    <Route path="*" element={<NotFound />} />
                                </Route>
                                <Route
                                    element={
                                        <Authenticated
                                            key="authenticated-outer"
                                            fallback={<Outlet />}
                                        >
                                            <NavigateToResource />
                                        </Authenticated>
                                    }
                                >
                                    <Route path="/login" element={<Login />} />
                                    <Route
                                        path="/register"
                                        element={<Register />}
                                    />
                                    <Route
                                        path="/forgot-password"
                                        element={<ForgotPassword />}
                                    />
                                </Route>
                            </Routes>

                            <RefineKbar />
                            <UnsavedChangesNotifier />
                            <DocumentTitleHandler />
                        </Refine>
                    </AntdApp>
                </ColorModeContextProvider>
            </RefineKbarProvider>
        </BrowserRouter>
    );
};

export default App;
