import {
    Authenticated,
    GitHubBanner,
    HttpError,
    Refine,
    useApiUrl,
    useCustom,
} from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import axios, { AxiosRequestConfig } from "axios";
import { useTranslation } from "react-i18next";
import {
    ErrorComponent,
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
import { authProvider } from "./authProvider";
import { Header } from "./components/header";
import { ColorModeContextProvider } from "./contexts/color-mode";
import {
    BlogPostCreate,
    BlogPostEdit,
    BlogPostList,
    BlogPostShow,
} from "./pages/blog-posts";
import {
    CategoryCreate,
    CategoryEdit,
    CategoryList,
    CategoryShow,
} from "./pages/categories";
import { ForgotPassword } from "./pages/forgotPassword";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import dataProvider from "./dataProvider";
import { resources } from "./resources";
import { TOKEN_KEY } from "./constants";

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
                            accessControlProvider={{
                                can: async ({ resource, action }) => {
                                    if (
                                        resource == "post" &&
                                        action == "edit"
                                    ) {
                                        return {
                                            can: false,
                                            reason: "Unauthorized",
                                        };
                                    }
                                    return { can: true };
                                },
                                options: {
                                    buttons: {
                                        enableAccessControl: true,
                                        hideIfUnauthorized: true,
                                    },
                                    queryOptions: {
                                        // ... default global query options
                                    },
                                },
                            }}
                            dataProvider={dataProvider(axiosInstance)}
                            notificationProvider={useNotificationProvider}
                            routerProvider={routerBindings}
                            authProvider={authProvider(axiosInstance)}
                            resources={resources}
                            options={{
                                syncWithLocation: true,
                                warnWhenUnsavedChanges: true,
                                useNewQueryKeys: true,
                                projectId: "m03TmB-6AokxR-OdrSlZ",
                            }}
                        >
                            <Routes>
                                <Route
                                    element={
                                        <Authenticated
                                            key="authenticated-inner"
                                            fallback={
                                                <CatchAllNavigate to="/login" />
                                            }
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
                                        </Authenticated>
                                    }
                                >
                                    <Route
                                        index
                                        element={
                                            <NavigateToResource resource="post" />
                                        }
                                    />
                                    <Route path="/:resource">
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
                                    </Route>
                                    <Route path="/blog-posts">
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
                                    </Route>
                                    <Route path="/categories">
                                        <Route
                                            index
                                            element={<CategoryList />}
                                        />
                                        <Route
                                            path="create"
                                            element={<CategoryCreate />}
                                        />
                                        <Route
                                            path="edit/:id"
                                            element={<CategoryEdit />}
                                        />
                                        <Route
                                            path="show/:id"
                                            element={<CategoryShow />}
                                        />
                                    </Route>
                                    <Route
                                        path="*"
                                        element={<ErrorComponent />}
                                    />
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
