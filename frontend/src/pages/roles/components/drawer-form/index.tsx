import { Form, FormItem } from "@/components";
import { Drawer, DrawerContent, DrawerFooter } from "@/components/drawer";
import { useEditForm } from "@/hooks";
import { IRole, Nullable } from "@/interfaces";
import { Button, Stack } from "@mui/material";
import { BaseKey, HttpError, useTranslate } from "@refinedev/core";
import { FC } from "react";
import {
    SwitchElement,
    TextareaAutosizeElement,
    TextFieldElement,
} from "react-hook-form-mui";

type Props = {
    id?: BaseKey;
    action: "create" | "edit";
};

export const RoleDrawerForm: FC<Props> = ({ action }) => {
    const t = useTranslate();
    const {
        refineCore: { onFinish, id },
        saveButtonProps,
        close,
        ...methods
    } = useEditForm<IRole, HttpError, Nullable<IRole>>({
        action,
        defaultValues: {
            code: "",
            name: "",
            description: "",
            valid_state: true,
        },
    });

    return (
        <Drawer
            slotProps={{
                paper: { sx: { width: { sm: "100%", md: "616px" } } },
            }}
            open={true}
            title={id ? t("roles.actions.edit") : t("roles.actions.add")}
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
                        label={t("roles.fields.name")}
                        required
                        htmlFor="name"
                    >
                        <TextFieldElement name="name" id="name" />
                    </FormItem>

                    <FormItem
                        label={t("roles.fields.code")}
                        required
                        htmlFor="code"
                    >
                        <TextFieldElement name="code" id="code" />
                    </FormItem>
                    <FormItem
                        label={t("roles.fields.description")}
                        htmlFor="description"
                    >
                        <TextareaAutosizeElement
                            name="description"
                            hiddenLabel
                            maxRows={3}
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
