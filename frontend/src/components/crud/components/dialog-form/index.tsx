import { SchemaForm } from "@/components";
import { DrawerHeader } from "@/components/drawer";
import { Nullable, Schema } from "@/interfaces";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    Divider,
    Stack,
} from "@mui/material";
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

export const CrudDialogForm: FC<Props> = ({ action }) => {
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
                onDialogCLose();
            },
        },
    });

    const onDialogCLose = () => {
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
        <Dialog
            open={true}
            onClose={onDialogCLose}
            slotProps={{ paper: { sx: { minWidth: 700 } } }}
        >
            <DrawerHeader
                title={schema?.title}
                onCloseClick={() => {
                    onDialogCLose();
                }}
            />
            <DialogContent>
                {schema && <SchemaForm schema={schema} formContext={methods} />}
            </DialogContent>
            <Divider />
            <DialogActions>
                <Stack direction="row">
                    <Button onClick={onDialogCLose}>
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
            </DialogActions>
        </Dialog>
    );
};
