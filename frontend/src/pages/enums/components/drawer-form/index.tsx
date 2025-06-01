import { Form, FormItem } from "@/components";
import { Drawer, DrawerContent, DrawerFooter } from "@/components/drawer";
import { IEnum, Nullable } from "@/interfaces";
import { Button, Stack } from "@mui/material";
import {
    BaseKey,
    HttpError,
    useGetToPath,
    useGo,
    useTranslate,
} from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { FC } from "react";
import {
    SubmitHandler,
    TextareaAutosizeElement,
    TextFieldElement,
} from "react-hook-form-mui";
import { useSearchParams } from "react-router";
import { EnumOptionsField } from "./enum-options";

type Props = {
    id?: BaseKey;
    action: "create" | "edit";
};

export const EnumDrawerForm: FC<Props> = ({ action }) => {
    const getToPath = useGetToPath();
    const [searchParams] = useSearchParams();
    const t = useTranslate();
    const go = useGo();
    const {
        refineCore: { onFinish, id, formLoading },
        saveButtonProps,
        ...methods
    } = useForm<IEnum, HttpError, Nullable<IEnum>>({
        defaultValues: {
            key: "",
            name: "",
            description: "",
            items: [],
        },
        refineCoreProps: {
            action,
            redirect: "list",
            onMutationSuccess: () => {
                onDrawerCLose();
            },
            updateMutationOptions: {
                onSettled: (variables) => {
                    console.log("111", variables);
                    return {};
                },
            },
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

    const onSubmit: SubmitHandler<IEnum> = (data) => {
        onFinish({
            ...data,
            items: data.items!.map(
                ({ name, value, id, description }, index) => {
                    return {
                        name,
                        value,
                        description,
                        sort: index + 1,
                        id,
                    };
                }
            ),
        }).catch(() => {});
    };

    return (
        <Drawer
            slotProps={{
                paper: { sx: { width: { sm: "100%", md: "720px" } } },
            }}
            open={true}
            title={id ? "Edit Enum" : "Create Enum"}
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
                        <TextFieldElement name="name" id="name" />
                    </FormItem>

                    <FormItem label="Key" required htmlFor="key">
                        <TextFieldElement name="key" id="key" />
                    </FormItem>
                    <FormItem label="Description" htmlFor="description">
                        <TextareaAutosizeElement
                            name="description"
                            hiddenLabel
                            maxRows={3}
                            id="description"
                        />
                    </FormItem>
                    <FormItem label="Enum Options">
                        <EnumOptionsField />
                    </FormItem>
                </Form>
            </DrawerContent>
            <DrawerFooter>
                <Stack direction="row">
                    <Button onClick={onDrawerCLose}>
                        {t("buttons.cancel")}
                    </Button>
                    <Button
                        disabled={formLoading}
                        onClick={methods.handleSubmit(onSubmit)}
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
