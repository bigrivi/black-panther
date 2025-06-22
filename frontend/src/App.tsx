import { useAccessControlProvider } from "@/hooks/useAccessControlProvider";
import { useAuthProvider } from "@/hooks/useAuthProvider";
import dataProvider from "@/providers/data-provider";
import { resources } from "@/resources";
import { CssBaseline, GlobalStyles } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import {
    RefineSnackbarProvider,
    useNotificationProvider,
} from "@refinedev/mui";
import routerBindings, {
    DocumentTitleHandler,
    UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { useTranslation } from "react-i18next";
import { BrowserRouter } from "react-router";
import "./App.css";
import { ColorModeContextProvider } from "./contexts";
import axiosInstance from "./libs/axios";
import { AppRoutes } from "./routes";
import { MountPoint } from "./utils/confirm";

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
                        <MountPoint />
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
