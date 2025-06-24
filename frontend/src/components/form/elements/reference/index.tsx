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

export type ReferenceElementProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
    TValue extends BaseRecord = BaseRecord
> = Omit<
    AutocompleteElementProps<TFieldValues, TName, TValue, false>,
    "options" | "autocompleteProps"
> & {
    resource: string;
    optionLabel?: string;
    optionValue?: string;
};

type ReferenceElementComponent = <
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
    TValue extends BaseRecord = BaseRecord
>(
    props: ReferenceElementProps<TFieldValues, TName, TValue> &
        RefAttributes<HTMLLabelElement>
) => JSX.Element;

const ReferenceElement = <
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
    TValue extends BaseRecord = BaseRecord
>(
    props: ReferenceElementProps<TFieldValues, TName, TValue>
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
        if (typeof fieldValue == "object") {
            setValue(name, fieldValue[optionValue]);
        }
    }, [fieldValue]);

    return (
        <AutocompleteElement
            name={name}
            {...rest}
            transform={{
                output: (event, value) => {
                    return value?.[optionValue] as PathValue<
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
ReferenceElement.displayName = "ReferenceElement";
export default ReferenceElement as ReferenceElementComponent;
