import { BaseRecord } from "@refinedev/core";
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

export type AutoCompleteSingleElementProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
    TValue extends BaseRecord = BaseRecord
> = Omit<
    AutocompleteElementProps<TFieldValues, TName, TValue, false>,
    "autocompleteProps" | "options" | "name"
> & {
    optionLabel?: string;
    optionValue?: string;
    name?: TName;
    options?: TValue[];
};

type AutoCompleteSingleElementComponent = <
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
    TValue extends BaseRecord = BaseRecord
>(
    props: AutoCompleteSingleElementProps<TFieldValues, TName, TValue> &
        RefAttributes<HTMLLabelElement>
) => JSX.Element;

const AutoCompleteSingleElement = <
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
    TValue extends BaseRecord = BaseRecord
>(
    props: AutoCompleteSingleElementProps<TFieldValues, TName, TValue>
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
        if (typeof fieldValue == "object") {
            setValue(name!, fieldValue[optionValue]);
        }
    }, [fieldValue, name]);

    return (
        <AutocompleteElement
            name={name!}
            options={options}
            transform={{
                output: (event, value) => {
                    return value?.[optionValue] as PathValue<
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
AutoCompleteSingleElement.displayName = "AutoCompleteSingleElement";
export default AutoCompleteSingleElement as AutoCompleteSingleElementComponent;
