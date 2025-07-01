import { BaseRecord } from "@refinedev/core";
import { FieldPath, FieldValues } from "react-hook-form";
import AutocompleteElement, { AutocompleteElementProps } from "../autocomplete";

export type AutocompleteArrayElementProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
    TValue extends BaseRecord = BaseRecord
> = Omit<
    AutocompleteElementProps<TFieldValues, TName, TValue, true>,
    "multiple"
>;

type AutocompleteElementComponent = <
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
    TValue extends BaseRecord = BaseRecord
>(
    props: AutocompleteArrayElementProps<TFieldValues, TName, TValue>
) => JSX.Element;

const AutocompleteArrayElement = <
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
    TValue extends BaseRecord = BaseRecord
>(
    props: AutocompleteArrayElementProps<TFieldValues, TName, TValue>
) => {
    return <AutocompleteElement {...props} multiple />;
};
AutocompleteArrayElement.displayName = "AutocompleteArrayElement";
export default AutocompleteArrayElement as AutocompleteElementComponent;
