import { BaseRecord } from "@refinedev/core";
import { FieldPath, FieldValues } from "react-hook-form";
import AutoCompleteElement, { AutoCompleteElementProps } from "../autocomplete";

export type AutoCompleteArrayElementProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
    TValue extends BaseRecord = BaseRecord
> = Omit<
    AutoCompleteElementProps<TFieldValues, TName, TValue, true>,
    "multiple"
>;

type AutoCompleteElementComponent = <
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
    return <AutoCompleteElement {...props} multiple />;
};
AutoCompleteArrayElement.displayName = "AutoCompleteArrayElement";
export default AutoCompleteArrayElement as AutoCompleteElementComponent;
