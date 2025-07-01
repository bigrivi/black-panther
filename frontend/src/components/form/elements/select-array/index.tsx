import { BaseRecord } from "@refinedev/core";
import { useEffect } from "react";
import {
    FieldPath,
    FieldValues,
    useFormContext,
    useWatch,
} from "react-hook-form";
import MultiSelectElement, { MultiSelectElementProps } from "../multi-select";

export type SelectArrayElementProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
    TValue extends BaseRecord = BaseRecord
> = Omit<
    MultiSelectElementProps<TFieldValues, TName, TValue>,
    "options" | "name" | "itemLabel" | "itemValue" | "showChips" | "ref"
> & {
    optionLabel?: string;
    optionValue?: string;
    name?: TName;
    showChips?: boolean;
    options?: TValue[];
};

type SelectArratElementComponent = <
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
    TValue extends BaseRecord = BaseRecord
>(
    props: SelectArrayElementProps<TFieldValues, TName, TValue>
) => JSX.Element;

const SelectArrayElement = function SelectArrayElement<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
    TValue extends BaseRecord = BaseRecord
>(props: SelectArrayElementProps<TFieldValues, TName, TValue>) {
    const {
        name,
        optionLabel = "name",
        optionValue = "id",
        showChips = true,
        options = [],
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
        <MultiSelectElement
            name={name!}
            itemLabel={optionLabel}
            itemValue={optionValue}
            options={options}
            showChips={showChips}
            transform={{
                input: (value) => {
                    if (Array.isArray(value) && value.length) {
                        if (typeof value[0] == "object") {
                            return value.map((item) => item[optionValue]);
                        }
                    }
                    return value;
                },
            }}
            {...rest}
        />
    );
};
SelectArrayElement.displayName = "SelectArrayElement";
export default SelectArrayElement as SelectArratElementComponent;
