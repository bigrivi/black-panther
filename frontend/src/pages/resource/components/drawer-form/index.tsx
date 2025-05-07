import { BaseKey, HttpError, useGetToPath, useGo } from "@refinedev/core";
import { Drawer } from "@/components/drawer/drawer";
import { IAction, IResource, Nullable } from "@/interfaces";
import { useSearchParams } from "react-router";
import { FC } from "react";
import { useForm } from "@refinedev/react-hook-form";
import { Control, Field, Help, Label } from "@/components";
import { DrawerContent, DrawerFooter } from "@/components/drawer";
import {
    Autocomplete,
    Button,
    OutlinedInput,
    Stack,
    TextField,
} from "@mui/material";
import { Controller } from "react-hook-form";

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
        handleSubmit,
        register,
        control,
        formState: { errors },
        refineCore: { onFinish, id },
        saveButtonProps,
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
                        (ele:any) => ele.name
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
                <form
                    onSubmit={handleSubmit((data) => {
                        onFinish(data);
                    })}
                >
                    <Stack spacing={2}>
                        <Field>
                            <Label htmlFor="name" required>
                                Name
                            </Label>
                            <Control>
                                <OutlinedInput
                                    {...register("name", {
                                        required: "Resource name is required",
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
                        <Field>
                            <Label htmlFor="key" required>
                                Key
                            </Label>
                            <Control>
                                <OutlinedInput
                                    {...register("key", {
                                        required: "Resource key is required",
                                    })}
                                    id="key"
                                    error={!!errors?.key?.message}
                                    fullWidth
                                />
                            </Control>
                            <Help error={!!errors?.key?.message}>
                                {errors?.key?.message ?? (
                                    <>
                                        Use this key in your code or when
                                        working with the API. The key is the
                                        unique identifier of the resource within
                                        a Permit Environment.
                                    </>
                                )}
                            </Help>
                        </Field>
                        <Field>
                            <Label htmlFor="actions" required>
                                Actions
                            </Label>
                            <Control>
                                <Controller
                                    control={control}
                                    name="actions"
                                    rules={{
                                        required:
                                            "Resource actions is required",
                                    }}
                                    render={({ field }) => (
                                        <Autocomplete
                                            multiple
                                            {...field}
                                            getOptionLabel={(option) => option}
                                            onChange={(_, value) => {
                                                field.onChange(value);
                                            }}
                                            options={defaultActionOptions}
                                            freeSolo
                                            disableCloseOnSelect
                                            renderInput={(params) => (
                                                <TextField
                                                    variant="outlined"
                                                    label={null}
                                                    placeholder="Add action..."
                                                    error={
                                                        !!errors?.actions
                                                            ?.message
                                                    }
                                                    {...params}
                                                />
                                            )}
                                            fullWidth
                                        />
                                    )}
                                />
                            </Control>
                            <Help error={!!errors?.actions?.message}>
                                {errors?.actions?.message ?? (
                                    <>
                                        Actions are the ways a user can act on a
                                        resource, or access the resource. After
                                        typing the action name into the box,
                                        press Enter or Return on your keyboard
                                        for the action to be correctly added.
                                    </>
                                )}
                            </Help>
                        </Field>
                    </Stack>
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
