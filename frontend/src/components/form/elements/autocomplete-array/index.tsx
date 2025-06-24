import { BaseRecord } from "@refinedev/core";
import { useEffect } from "react";
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

export type AutoCompleteArrayElementProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
    TValue extends BaseRecord = BaseRecord
> = Omit<
    AutocompleteElementProps<TFieldValues, TName, TValue, true>,
    "autocompleteProps" | "options" | "name"
> & {
    optionLabel?: string;
    optionValue?: string;
    name?: TName;
    options?: TValue[];
};

type AutoCompleteArrayElementComponent = <
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
    TValue extends BaseRecord = BaseRecord
>(
    props: AutoCompleteArrayElementProps<TFieldValues, TName, TValue>
) => JSX.Element;

const AutoCompleteArrayElement = <
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
    TValue extends BaseRecord = BaseRecord
>(
    props: AutoCompleteArrayElementProps<TFieldValues, TName, TValue>
) => {
    const {
        name,
        optionLabel = "name",
        optionValue = "id",
        options = [],
        ...rest
    } = props;
    const { setValue } = useFormContext();

    const fieldValue = useWatch({ name: name! });

    useEffect(() => {
        if (!fieldValue) {
            return;
        }
        const index = fieldValue.findIndex((value) => {
            return typeof value == "object";
        });
        if (index >= 0) {
            setValue(
                name!,
                fieldValue.map((item) => item[optionValue])
            );
        }
    }, [fieldValue, name]);

    return (
        <AutocompleteElement
            name={name!}
            options={options}
            multiple
            transform={{
                output: (event, value) => {
                    return value.map((item) => item[optionValue]) as PathValue<
                        TFieldValues,
                        TName
                    >;
                },
            }}
            autocompleteProps={{
                getOptionKey: (option) => option?.[optionValue],
                getOptionLabel: (option) => option?.[optionLabel],
                isOptionEqualToValue: (option, value) => {
                    return (
                        value === undefined ||
                        option?.[optionValue]?.toString() ===
                            (value?.[optionValue] ?? value)?.toString()
                    );
                },
            }}
            {...rest}
        />
    );
};
AutoCompleteArrayElement.displayName = "AutoCompleteArrayElement";
export default AutoCompleteArrayElement as AutoCompleteArrayElementComponent;
