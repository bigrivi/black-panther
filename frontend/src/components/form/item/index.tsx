import React, { FC, PropsWithChildren, ReactNode } from "react";
import { useFormContext } from "../context";
import { FormControl } from "../control";
import { FormField, FormFieldBody, FormFieldLabel } from "../field";
import { FormLabel } from "../label";
import { FormLayout } from "../types";

type FormItemProps = {
    label?: ReactNode;
    htmlFor?: string;
    required?: boolean;
    layout?: FormLayout;
};
export const FormItem: FC<PropsWithChildren<FormItemProps>> = ({
    children,
    label,
    htmlFor,
    required,
    layout,
}) => {
    let { layout: layoutFromContext } = useFormContext();
    layout = layout || layoutFromContext;
    const renderLabel = () => {
        return (
            <FormLabel required={required} htmlFor={htmlFor}>
                {label}
            </FormLabel>
        );
    };
    const renderControl = () => {
        if (!children) {
            return null;
        }
        return (
            <FormControl>
                {React.cloneElement(children as React.ReactElement, {
                    required,
                })}
            </FormControl>
        );
    };
    if (layout == "horizontal") {
        return (
            <FormField horizontal>
                <FormFieldLabel>{renderLabel()}</FormFieldLabel>
                <FormFieldBody>{renderControl()}</FormFieldBody>
            </FormField>
        );
    }

    return (
        <FormField>
            {renderLabel()}
            {renderControl()}
        </FormField>
    );
};
