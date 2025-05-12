import { FC, PropsWithChildren, ReactNode } from "react";
import { FormControl } from "./control";
import { FormField, FormFieldBody, FormFieldLabel } from "./field";
import { FormLabel } from "./label";

type FormItemProps = {
    label?: ReactNode;
    htmlFor?: string;
    required?: boolean;
    layout?: "vertical" | "horizontal";
};
export const FormItem: FC<PropsWithChildren<FormItemProps>> = ({
    children,
    label,
    htmlFor,
    required,
    layout,
}) => {
    const renderLabel = () => {
        return (
            <FormLabel required={required} htmlFor={htmlFor}>
                {label}
            </FormLabel>
        );
    };
    const renderControl = () => {
        return <FormControl>{children}</FormControl>;
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
