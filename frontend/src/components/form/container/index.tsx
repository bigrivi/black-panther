import { Stack, StackProps } from "@mui/material";
import { PropsWithChildren } from "react";
import {
    FieldValues,
    FormContainer,
    FormContainerProps,
} from "react-hook-form-mui";
import { FormContext } from "../context";
import { FormLayout } from "../types";

type FormProps<T extends FieldValues = FieldValues> = PropsWithChildren<
    FormContainerProps<T> & {
        layout?: FormLayout;
    } & Pick<StackProps, "spacing">
>;

export function Form<TFieldValues extends FieldValues = FieldValues>({
    children,
    spacing = 2,
    layout = "vertical",
    ...rest
}: PropsWithChildren<FormProps<TFieldValues>>) {
    return (
        <FormContainer<TFieldValues> {...rest}>
            <FormContext.Provider value={{ layout }}>
                <Stack className="Form-root" spacing={spacing}>
                    {children}
                </Stack>
            </FormContext.Provider>
        </FormContainer>
    );
}
