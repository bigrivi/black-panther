import { Form, FormItem } from "@/components";
import { Drawer, DrawerContent, DrawerFooter } from "@/components/drawer";
import { useEditForm } from "@/hooks";
import { IParameter, Nullable } from "@/interfaces";
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

export const ParameterDrawerForm: FC<Props> = ({ action }) => {
    const t = useTranslate();
    const {
        refineCore: { onFinish, id },
        saveButtonProps,
        close,
        ...methods
    } = useEditForm<IParameter, HttpError, Nullable<IParameter>>({
        action,
        defaultValues: {
            key: "",
            name: "",
            value: "",
            description: "",
            is_system: false,
        },
    });

    return (
        <Drawer
            slotProps={{
                paper: { sx: { width: { sm: "100%", md: "616px" } } },
            }}
            open={true}
            title={
                id
                    ? t("parameterSettings.actions.edit")
                    : t("parameterSettings.actions.add")
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
                        label={t("parameterSettings.fields.name")}
                        required
                        htmlFor="name"
                    >
                        <TextFieldElement name="name" id="name" />
                    </FormItem>

                    <FormItem
                        label={t("parameterSettings.fields.key")}
                        required
                        htmlFor="key"
                    >
                        <TextFieldElement name="key" id="key" />
                    </FormItem>
                    <FormItem
                        label={t("parameterSettings.fields.value")}
                        required
                        htmlFor="value"
                    >
                        <TextFieldElement name="value" id="value" />
                    </FormItem>
                    <FormItem
                        label={t("parameterSettings.fields.description")}
                        htmlFor="description"
                    >
                        <TextareaAutosizeElement
                            name="description"
                            hiddenLabel
                            maxRows={3}
                            id="description"
                        />
                    </FormItem>
                    <FormItem label={t("parameterSettings.fields.builtIn")}>
                        <SwitchElement label="" name={`is_system`} />
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
