import { SchemaForm } from "@/components";
import { Drawer, DrawerContent, DrawerFooter } from "@/components/drawer";
import { Nullable, Schema } from "@/interfaces";
import { Button, Stack } from "@mui/material";
import {
    BaseKey,
    HttpError,
    useCustom,
    useGetToPath,
    useGo,
    useResource,
    useTranslate,
} from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { FC, useMemo } from "react";
import { useSearchParams } from "react-router";

type Props = {
    id?: BaseKey;
    action: "create" | "edit";
};

export const CrudDrawerForm: FC<Props> = ({ action }) => {
    const getToPath = useGetToPath();
    const [searchParams] = useSearchParams();
    const t = useTranslate();
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
                onDrawerCLose();
            },
        },
    });

    const onDrawerCLose = () => {
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

    return (
        <Drawer
            slotProps={{
                paper: { sx: { width: { sm: "100%", md: "616px" } } },
            }}
            open={true}
            title={schema?.title}
            anchor="right"
            onClose={onDrawerCLose}
        >
            <DrawerContent>
                <Stack
                    bgcolor="background.paper"
                    padding="24px"
                    sx={{ flex: 1, overflow: "auto" }}
                >
                    {schema && (
                        <SchemaForm schema={schema} formContext={methods} />
                    )}
                </Stack>
            </DrawerContent>
            <DrawerFooter>
                <Stack direction="row">
                    <Button onClick={onDrawerCLose}>
                        {t("buttons.cancel")}
                    </Button>
                    <Button
                        {...saveButtonProps}
                        variant="contained"
                        color="primary"
                        type="submit"
                    >
                        {t("buttons.save")}
                    </Button>
                </Stack>
            </DrawerFooter>
        </Drawer>
    );
};
