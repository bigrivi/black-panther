import type { AuthProvider } from "@refinedev/core";
import { AxiosInstance } from "axios";
import { API_URL, TOKEN_KEY } from "./constants";

export const authProvider = (axiosInstance: AxiosInstance): AuthProvider => {
    return {
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
                console.log(data);
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
            localStorage.removeItem(TOKEN_KEY);
            return {
                success: true,
                redirectTo: "/login",
            };
        },
        check: async () => {
            const token = localStorage.getItem(TOKEN_KEY);
            if (token) {
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
            try {
                const { data } = await axiosInstance.get(`${API_URL}/user/me`);
                return data;
            } catch (error: any) {
                console.log(error.response.data);
            }
            return null;
        },
        onError: async (error) => {
            console.error(error);
            return { error };
        },
    };
};
