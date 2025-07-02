import { BaseRecord } from "@refinedev/core";
import { useEffect } from "react";
import {
    FieldPath,
    FieldValues,
    useFormContext,
    useWatch,
} from "react-hook-form";
import {
    CheckboxButtonGroup,
    CheckboxButtonGroupProps,
} from "react-hook-form-mui";

export type CheckboxGroupElementProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
    TValue extends BaseRecord = BaseRecord
> = Omit<
    CheckboxButtonGroupProps<TFieldValues, TName, TValue>,
    "options" | "name" | "labelKey" | "valueKey" | "returnObject"
> & {
    optionLabel?: string;
    optionValue?: string;
    name?: TName;
    options?: TValue[];
};

type CheckboxGroupElementComponent = <
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
    TValue extends BaseRecord = BaseRecord
>(
    props: CheckboxGroupElementProps<TFieldValues, TName, TValue>
) => JSX.Element;

const CheckboxGroupElement = function CheckboxGroupElement<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
    TValue extends BaseRecord = BaseRecord
>(props: CheckboxGroupElementProps<TFieldValues, TName, TValue>) {
    const {
        name,
        optionLabel = "name",
        optionValue = "id",
        options = [],
        row = true,
        ...rest
    } = props;
    const { setValue } = useFormContext();
    const fieldValue = useWatch({ name: name! });

    useEffect(() => {
        if (Array.isArray(fieldValue)) {
            const index = fieldValue.findIndex((value) => {
                return typeof value == "object";
            });
            if (index >= 0) {
                setValue(
                    name!,
                    fieldValue.map((item) => item[optionValue])
                );
            }
        }
    }, [fieldValue, name]);

    return (
        <CheckboxButtonGroup
            name={name!}
            labelKey={optionLabel}
            valueKey={optionValue}
            options={options}
            row={row}
            {...rest}
        />
    );
};
CheckboxGroupElement.displayName = "CheckboxGroupElement";
export default CheckboxGroupElement as CheckboxGroupElementComponent;
