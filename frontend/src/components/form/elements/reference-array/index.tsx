import { BaseRecord } from "@refinedev/core";
import { useAutocomplete } from "@refinedev/mui";
import { RefAttributes, useEffect } from "react";
import {
    FieldPath,
    FieldValues,
    PathValue,
    useFormContext,
    useWatch,
} from "react-hook-form";
import {
    AutocompleteElement,
    AutocompleteElementProps,
} from "react-hook-form-mui";

export type ReferenceArrayElementProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
    TValue extends BaseRecord = BaseRecord
> = Omit<
    AutocompleteElementProps<TFieldValues, TName, TValue, true>,
    "options" | "autocompleteProps"
> & {
    resource: string;
    optionLabel?: string;
    optionValue?: string;
};

type ReferenceArrayElementComponent = <
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
    TValue extends BaseRecord = BaseRecord
>(
    props: ReferenceArrayElementProps<TFieldValues, TName, TValue> &
        RefAttributes<HTMLLabelElement>
) => JSX.Element;

const ReferenceArrayElement = <
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
    TValue extends BaseRecord = BaseRecord
>(
    props: ReferenceArrayElementProps<TFieldValues, TName, TValue>
) => {
    const {
        name,
        resource,
        optionLabel = "name",
        optionValue = "id",
        ...rest
    } = props;
    const { setValue } = useFormContext();
    const { autocompleteProps } = useAutocomplete<TValue>({
        resource: resource,
    });

    const fieldValue = useWatch({ name });

    useEffect(() => {
        if (!fieldValue) {
            return;
        }
        const index = fieldValue.findIndex((value) => {
            return typeof value == "object";
        });
        if (index >= 0) {
            setValue(
                name,
                fieldValue.map((item) => item[optionValue])
            );
        }
    }, [fieldValue]);

    return (
        <AutocompleteElement
            name={name}
            multiple
            {...rest}
            transform={{
                output: (event, value) => {
                    return value.map((item) => item[optionValue]) as PathValue<
                        TFieldValues,
                        TName
                    >;
                },
            }}
            options={autocompleteProps.options as TValue[]}
            autocompleteProps={{
                getOptionLabel: (option) => option[optionLabel],
                isOptionEqualToValue: (option, value) => {
                    return (
                        value === undefined ||
                        option?.[optionValue]?.toString() ===
                            (value?.[optionValue] ?? value)?.toString()
                    );
                },
            }}
        />
    );
};
ReferenceArrayElement.displayName = "ReferenceArrayElement";
export default ReferenceArrayElement as ReferenceArrayElementComponent;
