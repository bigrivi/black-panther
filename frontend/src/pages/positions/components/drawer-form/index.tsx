import { Form, FormItem } from "@/components";
import { Drawer, DrawerContent, DrawerFooter } from "@/components/drawer";
import { useEditForm } from "@/hooks";
import { IPostion, Nullable } from "@/interfaces";
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

export const PositionDrawerForm: FC<Props> = ({ action }) => {
    const t = useTranslate();
    const {
        saveButtonProps,
        close,
        refineCore: { id },
        ...useHookFormResult
    } = useEditForm<IPostion, HttpError, Nullable<IPostion>>({
        action,
        defaultValues: {
            name: "",
            code: "",
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
            title={
                id ? t("positions.actions.edit") : t("positions.actions.add")
            }
            anchor="right"
            onClose={close}
        >
            <DrawerContent>
                <Form formContext={useHookFormResult}>
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
