import { Form, FormItem } from "@/components";
import { Drawer, DrawerContent, DrawerFooter } from "@/components/drawer";
import { IRole, IUser, Nullable } from "@/interfaces";
import { Button, Stack } from "@mui/material";
import { BaseKey, HttpError, useGetToPath, useGo } from "@refinedev/core";
import { useAutocomplete } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { FC } from "react";
import {
    AutocompleteElement,
    PasswordElement,
    TextFieldElement,
} from "react-hook-form-mui";
import { useSearchParams } from "react-router";

type Props = {
    id?: BaseKey;
    action: "create" | "edit";
};

interface IUserForm {
    login_name: string;
    user_name: string;
    created_at: string;
    password: string;
    confirm_password?: string;
    email: string;
    roles: IRole[];
}

export const UserDrawerForm: FC<Props> = ({ action }) => {
    const getToPath = useGetToPath();
    const [searchParams] = useSearchParams();
    const go = useGo();
    const {
        refineCore: { onFinish, id },
        saveButtonProps,
        ...methods
    } = useForm<IUser, HttpError, Nullable<IUserForm>>({
        defaultValues: {
            user_name: "",
            login_name: "",
            password: "",
            confirm_password: "",
            email: "",
            roles: [],
        },
        refineCoreProps: {
            resource: `user`,
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
                            roles: data.data.roles.map((item) => item.id),
                        },
                    };
                },
            },
        },
    });
    const { autocompleteProps } = useAutocomplete<IRole>({
        resource: "role",
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
            title={id ? "Edit User" : "Create User"}
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
                    <FormItem label="Login Name" required htmlFor="login_name">
                        <TextFieldElement name="login_name" id="login_name" />
                    </FormItem>
                    <FormItem
                        label="Password"
                        required={action == "create"}
                        htmlFor="password"
                    >
                        <PasswordElement name="password" id="password" />
                    </FormItem>
                    {action == "create" && (
                        <FormItem
                            label="Confirm Password"
                            required
                            htmlFor="confirm_password"
                        >
                            <PasswordElement
                                rules={{
                                    validate: (val) => {
                                        if (methods.watch("password") != val) {
                                            return "Confirm password do no match password";
                                        }
                                    },
                                }}
                                name="confirm_password"
                                id="confirm_password"
                            />
                        </FormItem>
                    )}

                    <FormItem label="User Name" required htmlFor="user_name">
                        <TextFieldElement name="user_name" id="user_name" />
                    </FormItem>
                    <FormItem label="Email" required htmlFor="email">
                        <TextFieldElement
                            type="email"
                            name="email"
                            id="email"
                        />
                    </FormItem>
                    <FormItem label="Roles" required>
                        <AutocompleteElement
                            name="roles"
                            multiple
                            transform={{
                                output: (event, value) => {
                                    return value.map((item) => item.id);
                                },
                            }}
                            options={autocompleteProps.options}
                            autocompleteProps={{
                                getOptionLabel: (option) => option.name,
                                isOptionEqualToValue: (option, value) =>
                                    value === undefined ||
                                    option?.id?.toString() ===
                                        (value?.id ?? value)?.toString(),
                            }}
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
