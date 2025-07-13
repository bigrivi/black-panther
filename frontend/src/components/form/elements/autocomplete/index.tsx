import { BaseRecord } from "@refinedev/core";
import isEqual from "lodash/isEqual";
import { useEffect, useRef } from "react";

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

export type AutocompleteElementProps<
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

type AutocompleteElementComponent = <
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
    TValue extends BaseRecord = BaseRecord,
    Multiple extends boolean | undefined = false
>(
    props: AutocompleteElementProps<TFieldValues, TName, TValue, Multiple>
) => JSX.Element;

const AutocompleteElement = <
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
    TValue extends BaseRecord = BaseRecord,
    Multiple extends boolean | undefined = false
>(
    props: AutocompleteElementProps<TFieldValues, TName, TValue, Multiple>
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
    const inputValueRef = useRef<any>();
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

    const matchOptionByValue = (value: TValue) => {
        return options.find((option) => {
            return (
                option?.[optionValue]?.toString() ===
                (value?.[optionValue] ?? value)?.toString()
            );
        });
    };

    return (
        <RHFAutocompleteElement
            name={name!}
            options={options}
            transform={{
                input: (newValue) => {
                    const value = multiple
                        ? (Array.isArray(newValue) ? newValue : []).map(
                              matchOptionByValue
                          )
                        : matchOptionByValue(newValue) ?? null;
                    if (!isEqual(value, inputValueRef.current)) {
                        inputValueRef.current = value;
                    }
                    return inputValueRef.current;
                },
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
                onInputChange: (event, value, reason) => {
                    if (event?.type === "change") {
                        onSearch && onSearch(value);
                    } else if (event?.type === "click") {
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
AutocompleteElement.displayName = "AutocompleteElement";
export default AutocompleteElement as AutocompleteElementComponent;
