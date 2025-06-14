import { TOKEN_KEY } from "@/constants";
import { useAccessControlProvider } from "@/hooks/useAccessControlProvider";
import { useAuthProvider } from "@/hooks/useAuthProvider";
import dataProvider from "@/providers/data-provider";
import { resources } from "@/resources";
import { CssBaseline, GlobalStyles } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { HttpError, Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import {
    RefineSnackbarProvider,
    useNotificationProvider,
} from "@refinedev/mui";
import routerBindings, {
    DocumentTitleHandler,
    UnsavedChangesNotifier,
} from "@refinedev/react-router";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { BrowserRouter } from "react-router";
import "./App.css";
import { ColorModeContextProvider } from "./contexts";
import { AppRoutes } from "./routes";

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
        translate: (
            key: string,
            params?: any,
            defaultMessage?: string
        ): string => {
            if (params && defaultMessage) {
                return t(key, defaultMessage, params) as string;
            } else {
                return t(key, params) as string;
            }
        },
        changeLocale: (lang: string) => i18n.changeLanguage(lang),
        getLocale: () => i18n.language,
    };

    return (
        <BrowserRouter>
            <RefineKbarProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <ColorModeContextProvider>
                        <CssBaseline />
                        <GlobalStyles
                            styles={{ html: { WebkitFontSmoothing: "auto" } }}
                        />
                        <RefineSnackbarProvider>
                            <Refine
                                i18nProvider={i18nProvider}
                                accessControlProvider={accessControlProvider}
                                dataProvider={dataProvider(axiosInstance)}
                                notificationProvider={useNotificationProvider}
                                routerProvider={routerBindings}
                                authProvider={authProvider}
                                resources={resources(t)}
                                options={{
                                    syncWithLocation: true,
                                    warnWhenUnsavedChanges: true,
                                    useNewQueryKeys: true,
                                    title: {
                                        text: "Black Panther",
                                    },
                                }}
                            >
                                <AppRoutes />
                                <UnsavedChangesNotifier />
                                <DocumentTitleHandler />
                                <RefineKbar />
                            </Refine>
                        </RefineSnackbarProvider>
                    </ColorModeContextProvider>
                </LocalizationProvider>
            </RefineKbarProvider>
        </BrowserRouter>
    );
};

export default App;
