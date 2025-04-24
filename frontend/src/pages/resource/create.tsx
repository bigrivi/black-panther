import { SaveButton, useDrawerForm, useForm } from "@refinedev/antd";
import { useGetToPath, useGo } from "@refinedev/core";
import { Button, Flex, Form, Grid, Input, Space, Spin } from "antd";
import { useSearchParams } from "react-router";
import { ResourceDrawerForm } from "./components/drawer-form";

export const ResourceCreate = () => {
    const getToPath = useGetToPath();
    const [searchParams] = useSearchParams();
    const go = useGo();

    return (
        <ResourceDrawerForm
            action="create"
            onMutationSuccess={() => {
                go({
                    to:
                        searchParams.get("to") ??
                        getToPath({
                            action: "list",
                        }) ??
                        "",
                    query: {
                        to: undefined,
                    },
                    options: {
                        keepQuery: true,
                    },
                    type: "replace",
                });
            }}
        />
    );
};
