import { Form, FormItem } from "@/components";
import { Drawer, DrawerContent, DrawerFooter } from "@/components/drawer";
import { IUser, Nullable } from "@/interfaces";
import { Button, Stack } from "@mui/material";
import {
    BaseKey,
    HttpError,
    useCustomMutation,
    useHandleNotification,
} from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { FC } from "react";
import { PasswordElement, SubmitHandler } from "react-hook-form-mui";

type Props = {
    id?: BaseKey;
    isOpen: boolean;
    onClose: () => void;
};

interface IPasswordModifyForm {
    password: string;
    confirm_password?: string;
}

export const PasswordModifyForm: FC<Props> = ({ isOpen, onClose, id }) => {
    const { refineCore, ...methods } = useForm<
        IUser,
        HttpError,
        Nullable<IPasswordModifyForm>
    >({
        defaultValues: {
            password: "",
            confirm_password: "",
        },
    });
    const handleNotification = useHandleNotification();
    const { mutateAsync: updateUserPassword, isLoading } = useCustomMutation();

    const onDrawerClose = () => {
        onClose();
    };

    const onSubmit: SubmitHandler<IPasswordModifyForm> = async (data) => {
        console.log(id, data);
        try {
            await updateUserPassword({
                url: `user/${id}/update_password`,
                method: "put",
                values: data.password,
            });
            handleNotification?.({
                type: "success",
                message: "Successfully modify user password",
                key: "notification-key",
            });
            onClose();
        } catch (error) {}
    };

    return (
        <Drawer
            slotProps={{
                paper: { sx: { width: { sm: "100%", md: "616px" } } },
            }}
            open={isOpen}
            title={"Modify User Password"}
            anchor="right"
            onClose={onDrawerClose}
        >
            <DrawerContent>
                <Form formContext={methods}>
                    <FormItem label="Password" required htmlFor="password">
                        <PasswordElement name="password" id="password" />
                    </FormItem>
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
                </Form>
            </DrawerContent>
            <DrawerFooter>
                <Stack direction="row">
                    <Button onClick={onDrawerClose}>Cancel</Button>
                    <Button
                        onClick={methods.handleSubmit(onSubmit)}
                        variant="contained"
                        loading={isLoading}
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
