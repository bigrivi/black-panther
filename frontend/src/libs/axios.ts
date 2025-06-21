import { TOKEN_KEY } from "@/constants";
import { HttpError } from "@refinedev/core";
import axios from "axios";
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

        if (
            error.response &&
            (error.response.status == 401 || error.response.status == 403)
        ) {
            localStorage.removeItem(TOKEN_KEY);
            const redirect = window.location.pathname + window.location.search;
            const encodeRedirect = encodeURIComponent(redirect);
            const url = "/login?redirect=" + encodeRedirect;
            window.location.href = "http://" + window.location.host + url;
            return Promise.resolve(error);
        }

        return Promise.reject(customError);
    }
);

export default axiosInstance;
