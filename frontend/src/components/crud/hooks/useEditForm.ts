import { Nullable, Schema, SchemeDataType } from "@/interfaces";
import {
    HttpError,
    useCustom,
    useGetToPath,
    useGo,
    useResource,
    useTranslate,
} from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { useEffect, useMemo } from "react";
import { UseFormReturn } from "react-hook-form";
import { useSearchParams } from "react-router";

const guessDefaultValue = (fieldKey: string, schema: Schema) => {
    const property = schema.properties[fieldKey];
    if (typeof property.default != "undefined" && property.default != null) {
        return property.default;
    }
    let type: SchemeDataType | undefined = undefined;
    if (property.type) {
        type = property.type;
    } else if (property.anyOf) {
        const refItem = property.anyOf.find((ele) => ele.$ref);
        if (refItem) {
            const refSchema = schema.$defs![refItem.$ref!.split("/").pop()!];
            type = refSchema.type;
        } else {
            const typeItem = property.anyOf.find((ele) => ele.type != "null");
            if (typeItem) {
                type = typeItem.type;
            }
        }
    }
    const typeDefaultMap: Record<SchemeDataType, any> = {
        array: [],
        boolean: false,
        integer: null,
        null: null,
        object: null,
        string: "",
    };
    if (type) {
        return typeDefaultMap[type];
    }
    return null;
};
interface UseEditFormHookResult {
    schema?: Schema;
    onBack: () => void;
    methods: UseFormReturn;
    title: string;
    saveButtonProps: {
        disabled: boolean;
        onClick: (e: React.BaseSyntheticEvent) => void;
    };
}
export const useEditForm = (
    action: "create" | "edit"
): UseEditFormHookResult => {
    const t = useTranslate();
    const getToPath = useGetToPath();
    const [searchParams] = useSearchParams();
    const { resource } = useResource();
    const go = useGo();
    const { data: schemaData } = useCustom<Schema>({
        url: `schema/${resource?.name}`,
        method: "get",
        config: {
            query: { type: action },
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
                    [key]: guessDefaultValue(key, schema),
                };
            }, {});
        }
        return {};
    }, [schema]);

    const {
        refineCore: { onFinish, id },
        saveButtonProps,
        ...methods
    } = useForm<any, HttpError, Nullable<any>>({
        defaultValues: defaultValues,
        refineCoreProps: {
            action,
            redirect: "list",
            onMutationSuccess: () => {
                onBack();
            },
        },
    });

    useEffect(() => {
        if (action == "create" && Object.keys(defaultValues).length) {
            methods.reset(defaultValues);
        }
    }, [defaultValues, action]);

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
    const title = id
        ? t(`${resource?.name}.actions.edit`)
        : t(`${resource?.name}.actions.add`);
    return {
        schema,
        onBack,
        methods,
        saveButtonProps,
        title,
    };
};
