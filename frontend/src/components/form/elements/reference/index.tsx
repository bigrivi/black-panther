import { BaseRecord } from "@refinedev/core";
import { useAutocomplete } from "@refinedev/mui";
import React from "react";
import { FieldPath, FieldValues } from "react-hook-form";
import AutoCompleteSingleElement from "../autocomplete-single";

export type ReferenceElementProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
    name: TName;
    resource: string;
    children?: JSX.Element;
};

type ReferenceElementComponent = <
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(
    props: ReferenceElementProps<TFieldValues, TName>
) => JSX.Element;

const ReferenceElement = <
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
    TValue extends BaseRecord = BaseRecord
>(
    props: ReferenceElementProps<TFieldValues, TName>
) => {
    const { name, resource, children = defaultChildren } = props;

    if (React.Children.count(children) !== 1) {
        throw new Error("<ReferenceArrayElement> only accepts a single child");
    }

    const { autocompleteProps } = useAutocomplete<TValue>({
        resource: resource,
    });

    return React.cloneElement(children as React.ReactElement, {
        options: autocompleteProps.options as TValue[],
        name,
    });
};
const defaultChildren = <AutoCompleteSingleElement />;
ReferenceElement.displayName = "ReferenceElement";
export default ReferenceElement as ReferenceElementComponent;
