import {
    BaseKey,
    BaseRecord,
    HttpError,
    useGetToPath,
    useGo,
} from "@refinedev/core";
import { Drawer } from "@/components/drawer/drawer";
import { IAction, IResource, Nullable } from "@/interfaces";
import { useSearchParams } from "react-router";
import { FC } from "react";
import { DrawerContent, DrawerFooter, DrawerHeader } from "@/components/drawer";
import { Control, Field, Help, Label } from "@/components";
import { Button, OutlinedInput, Stack } from "@mui/material";
import { useForm } from "@refinedev/react-hook-form";

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
        watch,
        control,
        setValue,
        handleSubmit,
        register,
        formState: { errors },
        refineCore: { onFinish, id, formLoading },
        saveButtonProps,
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
                <form
                    onSubmit={handleSubmit((data) => {
                        onFinish(data);
                    })}
                >
                    <Field>
                        <Label htmlFor="name" required>
                            Action Name
                        </Label>
                        <Control>
                            <OutlinedInput
                                {...register("name", {
                                    required: "Action name is required",
                                })}
                                id="name"
                                error={!!errors?.name?.message}
                                fullWidth
                            />
                        </Control>
                        <Help error={!!errors?.name?.message}>
                            {errors?.name?.message}
                        </Help>
                    </Field>
                </form>
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
