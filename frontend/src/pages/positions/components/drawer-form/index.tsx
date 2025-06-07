import { Form, FormItem } from "@/components";
import { Drawer, DrawerContent, DrawerFooter } from "@/components/drawer";
import { IPostion, Nullable } from "@/interfaces";
import { Button, Stack } from "@mui/material";
import {
    BaseKey,
    HttpError,
    useGetToPath,
    useGo,
    useTranslate,
} from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { FC } from "react";
import {
    SwitchElement,
    TextareaAutosizeElement,
    TextFieldElement,
} from "react-hook-form-mui";
import { useSearchParams } from "react-router";

type Props = {
    id?: BaseKey;
    action: "create" | "edit";
};

export const PositionDrawerForm: FC<Props> = ({ action }) => {
    const getToPath = useGetToPath();
    const [searchParams] = useSearchParams();
    const t = useTranslate();
    const go = useGo();
    const {
        refineCore: { onFinish, id },
        saveButtonProps,
        ...methods
    } = useForm<IPostion, HttpError, Nullable<IPostion>>({
        defaultValues: {
            name: "",
            code: "",
            description: "",
            valid_state: true,
        },
        refineCoreProps: {
            action,
            redirect: "list",
            onMutationSuccess: () => {
                onDrawerCLose();
            },
            queryOptions: {
                select: (data) => {
                    return {
                        data: {
                            ...data.data,
                        },
                    };
                },
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
            title={
                id ? t("positions.actions.edit") : t("positions.actions.add")
            }
            anchor="right"
            onClose={onDrawerCLose}
        >
            <DrawerContent>
                <Form
                    formContext={methods}
                    onSuccess={(data) => {
                        onFinish(data);
                    }}
                >
                    <FormItem
                        label={t("positions.fields.name")}
                        required
                        htmlFor="name"
                    >
                        <TextFieldElement name="name" id="name" />
                    </FormItem>

                    <FormItem
                        label={t("positions.fields.code")}
                        required
                        htmlFor="code"
                    >
                        <TextFieldElement name="code" id="code" />
                    </FormItem>
                    <FormItem
                        label={t("positions.fields.description")}
                        htmlFor="description"
                    >
                        <TextareaAutosizeElement
                            name="description"
                            id="description"
                        />
                    </FormItem>
                    <FormItem label={t("fields.status.label")}>
                        <SwitchElement
                            label={t("fields.status.true")}
                            name={`valid_state`}
                        />
                    </FormItem>
                </Form>
            </DrawerContent>
            <DrawerFooter>
                <Stack direction="row">
                    <Button onClick={onDrawerCLose}>Cancel</Button>
                    <Button
                        {...saveButtonProps}
                        variant="contained"
                        color="primary"
                        type="submit"
                    >
                        Save
                    </Button>
                </Stack>
            </DrawerFooter>
        </Drawer>
    );
};
