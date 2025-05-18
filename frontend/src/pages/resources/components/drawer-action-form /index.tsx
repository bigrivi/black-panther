import { Form, FormItem } from "@/components";
import { DrawerContent, DrawerFooter } from "@/components/drawer";
import { Drawer } from "@/components/drawer/drawer";
import { IAction, Nullable } from "@/interfaces";
import { Button, Stack } from "@mui/material";
import { BaseKey, HttpError, useGetToPath, useGo } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { FC } from "react";
import { TextFieldElement } from "react-hook-form-mui";
import { useSearchParams } from "react-router";

type Props = {
    id?: BaseKey;
    open: boolean;
    action: "create" | "edit";
    onClose?: () => void;
    resourceId?: BaseKey;
    onMutationSuccess?: () => void;
};

export interface ActionFormTypes {
    name: string;
}

export const ActionDrawerForm: FC<Props> = ({
    id: idProp,
    action,
    onClose,
    open,
    resourceId,
    onMutationSuccess,
}) => {
    const getToPath = useGetToPath();
    const [searchParams] = useSearchParams();
    const go = useGo();

    const {
        refineCore: { onFinish, id, formLoading },
        saveButtonProps,
        ...methods
    } = useForm<IAction, HttpError, Nullable<IAction>>({
        defaultValues: {
            name: "",
        },
        refineCoreProps: {
            resource: `resource/${resourceId}/action`,
            id: idProp,
            action,
            redirect: false,
            onMutationSuccess: () => {
                onMutationSuccess?.();
            },
        },
    });

    const onDrawerCLose = () => {
        if (onClose) {
            onClose();
            return;
        }
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
            open={open}
            title={id ? "Edit Action" : "Create Action"}
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
                                required: "Action name is required",
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
