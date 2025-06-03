import type { AuthProvider } from "@refinedev/core";
import { AxiosInstance } from "axios";
import { useCallback, useState } from "react";
import { API_URL, TOKEN_KEY } from "../../constants";

interface AuthProviderHookResult {
    authProvider: AuthProvider;
    user: any;
}
export const useAuthProvider = (
    axiosInstance: AxiosInstance
): AuthProviderHookResult => {
    const [user, setUser] = useState(null);
    const fetchUserInfo = useCallback(async () => {
        try {
            const { data } = await axiosInstance.get(`${API_URL}/user/me`);
            setUser(data);
        } catch (error: any) {
            console.log(error.response.data);
        }
    }, []);
    const authProvider: AuthProvider = {
        login: async ({ username, loginName, password, uuid, captcha }) => {
            try {
                const { data } = await axiosInstance.post(
                    `${API_URL}/auth/login`,
                    {
                        login_name: loginName,
                        password,
                        uuid,
                        captcha,
                    }
                );
                localStorage.setItem(TOKEN_KEY, data.access_token);
                return {
                    success: true,
                    redirectTo: "/",
                };
            } catch (error: any) {
                console.log(error.response.data);
                return {
                    success: false,
                    unlockDate: error.response.data.data?.unlock_date,
                    error: {
                        name: "LoginError",
                        message: error.response.data.msg,
                    },
                };
            }
        },
        logout: async () => {
            setUser(null);
            localStorage.removeItem(TOKEN_KEY);
            return {
                success: true,
                redirectTo: "/login",
            };
        },
        check: async () => {
            const token = localStorage.getItem(TOKEN_KEY);
            if (token) {
                await fetchUserInfo();
                return {
                    authenticated: true,
                };
            }

            return {
                authenticated: false,
                redirectTo: "/login",
            };
        },
        getPermissions: async () => null,
        getIdentity: async () => {
            return user;
        },
        onError: async (error) => {
            console.error(error);
            return { error };
        },
    };

    return {
        authProvider,
        user,
    };
};
