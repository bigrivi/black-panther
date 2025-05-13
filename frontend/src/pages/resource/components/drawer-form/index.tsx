import { Form, FormItem } from "@/components";
import { DrawerContent, DrawerFooter } from "@/components/drawer";
import { Drawer } from "@/components/drawer/drawer";
import { Nullable } from "@/interfaces";
import { Button, Stack } from "@mui/material";
import { BaseKey, HttpError, useGetToPath, useGo } from "@refinedev/core";
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
    const {
        refineCore: { onFinish, id },
        saveButtonProps,
        ...methods
    } = useForm<ResourceFormType, HttpError, Nullable<ResourceFormType>>({
        defaultValues: {
            name: "",
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
            title={id ? "Edit Resource" : "Create Resource"}
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
                    <FormItem label="Name" required htmlFor="name">
                        <TextFieldElement
                            name="name"
                            id="name"
                            rules={{
                                required: "Resource name is required",
                            }}
                        />
                    </FormItem>
                    <FormItem label="Key" required htmlFor="key">
                        <TextFieldElement
                            name="key"
                            id="key"
                            helperText="Use this key in your code or when
                                        working with the API. The key is the
                                        unique identifier of the resource within
                                        a Permit Environment."
                            rules={{
                                required: "Resource key is required",
                            }}
                        />
                    </FormItem>
                    <FormItem label="Actions" required>
                        <AutocompleteElement
                            name="actions"
                            multiple
                            options={defaultActionOptions}
                            rules={{
                                required: "Resource action is required",
                            }}
                            textFieldProps={{
                                placeholder: "Add action...",
                                helperText: `Actions are the ways a user can act on a
                                        resource, or access the resource. After
                                        typing the action name into the box,
                                        press Enter or Return on your keyboard
                                        for the action to be correctly added.`,
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
