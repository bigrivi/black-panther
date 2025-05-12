import { Stack, StackProps } from "@mui/material";
import { PropsWithChildren } from "react";
import {
    FieldValues,
    FormContainer,
    FormContainerProps,
} from "react-hook-form-mui";

type FormProps<T extends FieldValues = FieldValues> = PropsWithChildren<
    FormContainerProps<T> & {
        layout?: "vertical" | "horizontal";
    } & Pick<StackProps, "spacing">
>;

export function Form<TFieldValues extends FieldValues = FieldValues>({
    children,
    spacing = 2,
    layout = "vertical",
    ...rest
}: PropsWithChildren<FormProps<TFieldValues>>) {
    return (
        <FormContainer {...rest}>
            <Stack spacing={spacing}>{children}</Stack>
        </FormContainer>
    );
}
