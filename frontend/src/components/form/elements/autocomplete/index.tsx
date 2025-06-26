import { BaseRecord } from "@refinedev/core";
import { useEffect, useState } from "react";
import {
    FieldPath,
    FieldValues,
    PathValue,
    useFormContext,
    useWatch,
} from "react-hook-form";
import {
    AutocompleteElement as RHFAutocompleteElement,
    AutocompleteElementProps as RHFAutocompleteElementProps,
} from "react-hook-form-mui";

export type AutoCompleteElementProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
    TValue extends BaseRecord = BaseRecord,
    Multiple extends boolean | undefined = false
> = Omit<
    RHFAutocompleteElementProps<TFieldValues, TName, TValue, Multiple>,
    "autocompleteProps" | "options" | "name"
> & {
    optionLabel?: string;
    optionValue?: string;
    name?: TName;
    options?: TValue[];
    onSearch?: (value: string) => void;
};

type AutoCompleteElementComponent = <
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
    TValue extends BaseRecord = BaseRecord,
    Multiple extends boolean | undefined = false
>(
    props: AutoCompleteElementProps<TFieldValues, TName, TValue, Multiple>
) => JSX.Element;

const AutoCompleteElement = <
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
    TValue extends BaseRecord = BaseRecord,
    Multiple extends boolean | undefined = false
>(
    props: AutoCompleteElementProps<TFieldValues, TName, TValue, Multiple>
) => {
    const {
        name,
        optionLabel = "name",
        optionValue = "id",
        options = [],
        onSearch,
        multiple = false,
        ...rest
    } = props;
    const { setValue } = useFormContext();
    const [filterValue, setFilterValue] = useState("");

    const fieldValue = useWatch({ name: name! });

    useEffect(() => {
        if (!fieldValue) {
            return;
        }
        if (multiple && Array.isArray(fieldValue)) {
            const index = fieldValue.findIndex((value) => {
                return typeof value == "object";
            });
            if (index >= 0) {
                setValue(
                    name!,
                    fieldValue.map((item) => item[optionValue])
                );
            }
        } else if (!multiple && typeof fieldValue == "object") {
            setValue(name!, fieldValue[optionValue]);
        }
    }, [fieldValue, name]);

    return (
        <RHFAutocompleteElement
            name={name!}
            options={options}
            transform={{
                output: (event, value) => {
                    if (Array.isArray(value)) {
                        return value.map(
                            (item) => item[optionValue]
                        ) as PathValue<TFieldValues, TName>;
                    }
                    return value?.[optionValue] as PathValue<
                        TFieldValues,
                        TName
                    >;
                },
            }}
            autocompleteProps={{
                inputValue: filterValue,
                onInputChange: (event, value) => {
                    if (event?.type === "change") {
                        setFilterValue(value);
                        onSearch && onSearch(value);
                    } else if (event?.type === "click") {
                        setFilterValue(value);
                        onSearch && onSearch("");
                    }
                },
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
            multiple={multiple}
            {...rest}
        />
    );
};
AutoCompleteElement.displayName = "AutoCompleteElement";
export default AutoCompleteElement as AutoCompleteElementComponent;
