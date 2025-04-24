import { CrudFilters, CrudOperators, DataProvider } from "@refinedev/core";
import restDataProvider from "@refinedev/simple-rest";
import { stringify } from "query-string";
import { AxiosInstance } from "axios";
import { BetterCRUDQuery } from "./types";
import { handleFilter, handlePagination, handleSort } from "./utils";
import { transformHttpError } from "./utils/transformHttpError";
import { API_URL } from "../../constants";

export const dataProvider = (axios: AxiosInstance): DataProvider => {
    return {
        ...restDataProvider(API_URL, axios),
        getList: async ({ resource, pagination, filters, sorters, meta }) => {
            let url = `${API_URL}/${resource}`;
            if (meta?.isTree) {
                url = url + "/tree";
            }
            let query: BetterCRUDQuery = {};
            query = handleFilter(query, filters);
            query = handlePagination(query, pagination);
            query = handleSort(query, sorters);
            const { data } = await axios.get(`${url}?${stringify(query)}`, {
                paramsSerializer: {
                    indexes: null,
                },
            });

            if (Array.isArray(data)) {
                return {
                    data,
                    total: data.length,
                };
            }

            return {
                data: data.items,
                total: data.total,
            };
        },

        getMany: async ({ resource, ids, meta }) => {
            const url = `${API_URL}/${resource}`;
            let query: BetterCRUDQuery = {};
            if (ids && ids.length) {
                query["filter"] = ["id||$in||" + ids.join(",")];
            }
            const { data } = await axios.get(`${url}?${stringify(query)}`, {
                paramsSerializer: {
                    indexes: null,
                },
            });
            return {
                data,
            };
        },
        getOne: async ({ resource, id, meta }) => {
            const url = `${API_URL}/${resource}/${id}`;
            const { data } = await axios.get(url);
            return {
                data,
            };
        },
        create: async ({ resource, variables, meta }) => {
            const url = `${API_URL}/${resource}`;
            const { headers } = meta ?? {};
            try {
                const { data } = await axios.post(url, variables, {
                    headers,
                });

                return {
                    data,
                };
            } catch (error) {
                const httpError = transformHttpError(error);
                throw httpError;
            }
        },
        createMany: async ({ resource, variables }) => {
            try {
                const { data } = await axios.post(
                    `${API_URL}/${resource}/bulk`,
                    {
                        data: variables,
                    }
                );
                return { data };
            } catch (error) {
                const httpError = transformHttpError(error);
                throw httpError;
            }
        },
        update: async ({ resource, id, variables, meta }) => {
            const url = meta?.URLSuffix
                ? `${API_URL}/${resource}/${id}/${meta.URLSuffix}`
                : `${API_URL}/${resource}/${id}`;
            try {
                const { data } = meta?.URLSuffix
                    ? await axios.post(url)
                    : await axios.put(url, variables);

                return {
                    data,
                };
            } catch (error) {
                const httpError = transformHttpError(error);
                throw httpError;
            }
        },

        deleteOne: async ({ resource, id, variables, meta }) => {
            const url = meta?.URLSuffix
                ? `${API_URL}/${resource}/${id}/${meta.URLSuffix}`
                : `${API_URL}/${resource}/${id}`;
            try {
                const { data } = await axios.delete(url, {
                    data: variables,
                });

                return {
                    data,
                };
            } catch (error) {
                const httpError = transformHttpError(error);
                throw httpError;
            }
        },
        custom: async ({ url, method, payload, query, headers }) => {
            try {
                const { data } = await axios.request({
                    url: `${API_URL}/${url}`,
                    method,
                    data: payload,
                    params: query,
                    headers: headers,
                });

                return {
                    data,
                };
            } catch (error) {
                const httpError = transformHttpError(error);
                throw httpError;
            }
        },
    };
};
