import { Nullable, Schema } from "@/interfaces";
import {
    HttpError,
    useCustom,
    useGetToPath,
    useGo,
    useResource,
} from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { useMemo } from "react";
import { UseFormReturn } from "react-hook-form";
import { useSearchParams } from "react-router";
interface UseEditFormHookResult {
    schema?: Schema;
    onBack: () => void;
    methods: UseFormReturn;
    saveButtonProps: {
        disabled: boolean;
        onClick: (e: React.BaseSyntheticEvent) => void;
    };
}
export const useEditForm = (
    action: "create" | "edit"
): UseEditFormHookResult => {
    const getToPath = useGetToPath();
    const [searchParams] = useSearchParams();
    const { resource } = useResource();
    const go = useGo();
    const { data: schemaData } = useCustom<Schema>({
        url: `schema/${resource?.name}`,
        method: "get",
        config: {
            query: { type: "create" },
        },
    });

    const schema = useMemo(() => {
        return schemaData?.data;
    }, [schemaData]);

    const defaultValues = useMemo(() => {
        if (schema) {
            return Object.keys(schema.properties).reduce((acc, key) => {
                return {
                    ...acc,
                    [key]: "",
                };
            }, {});
        }
        return {};
    }, [schema]);

    const { refineCore, saveButtonProps, ...methods } = useForm<
        any,
        HttpError,
        Nullable<any>
    >({
        defaultValues: defaultValues,
        refineCoreProps: {
            action,
            redirect: "list",
            onMutationSuccess: () => {
                onBack();
            },
        },
    });

    const onBack = () => {
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
    };
    return {
        schema,
        onBack,
        methods,
        saveButtonProps,
    };
};
