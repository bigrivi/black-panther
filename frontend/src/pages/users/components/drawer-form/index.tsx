import { Form, FormItem } from "@/components";
import { Drawer, DrawerContent, DrawerFooter } from "@/components/drawer";
import {
    ReferenceArrayElement,
    ReferenceNodeElement,
    TreeSelectFieldElement,
} from "@/components/form/elements";
import { useEditForm } from "@/hooks";
import { IUser, Nullable } from "@/interfaces";
import { Button, Stack } from "@mui/material";
import { BaseKey, HttpError, useTranslate } from "@refinedev/core";
import { FC } from "react";
import {
    PasswordElement,
    SwitchElement,
    TextFieldElement,
} from "react-hook-form-mui";

type Props = {
    id?: BaseKey;
    action: "create" | "edit";
};

interface IUserForm extends Omit<IUser, "roles"> {
    password: string;
    confirm_password?: string;
    roles: number[];
}

export const UserDrawerForm: FC<Props> = ({ action }) => {
    const t = useTranslate();
    const {
        refineCore: { onFinish, id },
        close,
        saveButtonProps,
        ...methods
    } = useEditForm<IUser, HttpError, Nullable<IUserForm>>({
        action,
        defaultValues: {
            user_name: "",
            login_name: "",
            email: "",
            department_id: null,
            is_active: true,
            roles: [],
            positions: [],
            ...(action == "create" && {
                password: "",
                confirm_password: "",
            }),
        },
    });

    return (
        <Drawer
            slotProps={{
                paper: { sx: { width: { sm: "100%", md: "616px" } } },
            }}
            open={true}
            title={id ? t("users.actions.edit") : t("users.actions.add")}
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
                        label={t("users.fields.loginName")}
                        required
                        htmlFor="login_name"
                    >
                        <TextFieldElement name="login_name" id="login_name" />
                    </FormItem>

                    {action == "create" && (
                        <>
                            <FormItem
                                label={t("users.fields.password")}
                                required={action == "create"}
                                htmlFor="password"
                            >
                                <PasswordElement
                                    name="password"
                                    autoComplete="new-password"
                                    id="password"
                                />
                            </FormItem>
                            <FormItem
                                label={t("users.fields.confirmPassword")}
                                required
                                htmlFor="confirm_password"
                                rules={{
                                    validate: (val) => {
                                        if (methods.watch("password") != val) {
                                            return t(
                                                "users.errors.passwordMismatched"
                                            );
                                        }
                                    },
                                }}
                            >
                                <PasswordElement
                                    name="confirm_password"
                                    id="confirm_password"
                                />
                            </FormItem>
                        </>
                    )}

                    <FormItem
                        label={t("users.fields.userName")}
                        required
                        htmlFor="user_name"
                    >
                        <TextFieldElement
                            autoComplete="off"
                            name="user_name"
                            id="user_name"
                        />
                    </FormItem>
                    <FormItem
                        label={t("users.fields.email")}
                        required
                        htmlFor="email"
                    >
                        <TextFieldElement
                            type="email"
                            name="email"
                            id="email"
                        />
                    </FormItem>
                    <FormItem
                        label={t("users.fields.department")}
                        required
                        htmlFor="department_id"
                    >
                        <ReferenceNodeElement<IUser>
                            name="department_id"
                            resource="department"
                        >
                            <TreeSelectFieldElement />
                        </ReferenceNodeElement>
                    </FormItem>
                    <FormItem label={t("users.fields.roles")} required>
                        <ReferenceArrayElement<IUser>
                            name="roles"
                            resource="role"
                        ></ReferenceArrayElement>
                    </FormItem>
                    <FormItem label={t("users.fields.positions")} required>
                        <ReferenceArrayElement<IUser>
                            name="positions"
                            resource="position"
                        />
                    </FormItem>
                    <FormItem label={t("fields.status.label")}>
                        <SwitchElement
                            label={t("fields.status.true")}
                            name={`is_active`}
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
