import { Form, FormItem } from "@/components";
import { DrawerContent, DrawerFooter } from "@/components/drawer";
import { Drawer } from "@/components/drawer/drawer";
import { useEditForm } from "@/hooks";
import { Nullable } from "@/interfaces";
import { Button, Stack } from "@mui/material";
import { BaseKey, HttpError, useTranslate } from "@refinedev/core";
import { FC } from "react";
import { AutocompleteElement, TextFieldElement } from "react-hook-form-mui";

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
    const t = useTranslate();

    const {
        refineCore: { onFinish, id },
        saveButtonProps,
        close,
        ...methods
    } = useEditForm<ResourceFormType, HttpError, Nullable<ResourceFormType>>({
        action,
        defaultValues: {
            name: "",
            key: "",
            actions: [...defaultActionOptions],
        },
        refineCoreProps: {
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
            onClose={close}
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
                    <Button onClick={close}>{t("buttons.cancel")}</Button>
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
