import { Form, FormItem } from "@/components";
import { DrawerContent, DrawerFooter } from "@/components/drawer";
import { Drawer } from "@/components/drawer/drawer";
import { Nullable } from "@/interfaces";
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
import { AutocompleteElement, TextFieldElement } from "react-hook-form-mui";
import { useSearchParams } from "react-router";

type Props = {
    id?: BaseKey;
    action: "create" | "edit";
};

type ResourceFormType = {
    name: string;
    key: string;
    actions: string[];
};

const defaultActionOptions = ["list", "create", "edit", "show", "delete"];

export const ResourceDrawerForm: FC<Props> = ({ action }) => {
    const getToPath = useGetToPath();
    const [searchParams] = useSearchParams();
    const go = useGo();
    const t = useTranslate();

    const {
        refineCore: { onFinish, id },
        saveButtonProps,
        ...methods
    } = useForm<ResourceFormType, HttpError, Nullable<ResourceFormType>>({
        defaultValues: {
            name: "",
            key: "",
            actions: [...defaultActionOptions],
        },
        refineCoreProps: {
            resource: `resource`,
            action,
            redirect: "list",
            onMutationSuccess: () => {
                onDrawerCLose();
            },
            queryOptions: {
                select: (data) => {
                    const actions = data.data.actions?.map(
                        (ele: any) => ele.name
                    );
                    return {
                        data: {
                            ...data.data,
                            actions,
                        },
                    };
                },
            },
        },
    });

    const onDrawerCLose = () => {
        close();
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
                id ? t("resources.actions.edit") : t("resources.actions.add")
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
                        label={t("resources.fields.name")}
                        required
                        htmlFor="name"
                    >
                        <TextFieldElement name="name" id="name" />
                    </FormItem>
                    <FormItem
                        label={t("resources.fields.key.label")}
                        required
                        htmlFor="key"
                    >
                        <TextFieldElement
                            name="key"
                            id="key"
                            helperText={t("resources.fields.key.tips")}
                        />
                    </FormItem>
                    <FormItem
                        label={t("resources.fields.actions.label")}
                        required
                    >
                        <AutocompleteElement
                            name="actions"
                            multiple
                            options={defaultActionOptions}
                            textFieldProps={{
                                placeholder: t(
                                    "resources.fields.actions.placeholder"
                                ),
                                helperText: t("resources.fields.actions.tips"),
                            }}
                        />
                    </FormItem>
                </Form>
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
