import { Form, FormItem } from "@/components";
import { Drawer, DrawerContent, DrawerFooter } from "@/components/drawer";
import { TreeSelectFieldElement } from "@/components/form/elements";
import { IDepartment, IRole, IUser, Nullable } from "@/interfaces";
import { Button, Stack } from "@mui/material";
import {
    BaseKey,
    HttpError,
    useGetToPath,
    useGo,
    useList,
} from "@refinedev/core";
import { useAutocomplete } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { FC } from "react";
import {
    AutocompleteElement,
    PasswordElement,
    SwitchElement,
    TextFieldElement,
} from "react-hook-form-mui";
import { useSearchParams } from "react-router";

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
            department_id: null,
            is_active: null,
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

    const { data: deptTreeData } = useList<IDepartment>({
        resource: `department`,
        meta: {
            isTree: true,
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

                    {action == "create" && (
                        <>
                            <FormItem
                                label="Password"
                                required={action == "create"}
                                htmlFor="password"
                            >
                                <PasswordElement
                                    name="password"
                                    id="password"
                                />
                            </FormItem>
                            <FormItem
                                label="Confirm Password"
                                required
                                htmlFor="confirm_password"
                            >
                                <PasswordElement
                                    rules={{
                                        validate: (val) => {
                                            if (
                                                methods.watch("password") != val
                                            ) {
                                                return "Confirm password do no match password";
                                            }
                                        },
                                    }}
                                    name="confirm_password"
                                    id="confirm_password"
                                />
                            </FormItem>
                        </>
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
                    <FormItem
                        label="Department"
                        required
                        htmlFor="department_id"
                    >
                        <TreeSelectFieldElement
                            name="department_id"
                            fieldNames={{
                                label: "name",
                                value: "id",
                                children: "children",
                            }}
                            treeData={deptTreeData?.data ?? []}
                            id="department_id"
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
                    <FormItem label="Status">
                        <SwitchElement label="Enable" name={`is_active`} />
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
