import { BaseRecord, HttpError } from "@refinedev/core";
import { useAutocomplete, UseAutocompleteProps } from "@refinedev/mui";
import React from "react";
import {
    FieldPath,
    FieldValues,
    UseControllerProps,
    useWatch,
} from "react-hook-form";
import AutocompleteElement from "../autocomplete";
import AutocompleteArrayElement from "../autocomplete-array";

export type ReferenceArrayElementProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
    TQueryFnData extends BaseRecord = any,
    TError extends HttpError = HttpError,
    TData extends BaseRecord = TQueryFnData
> = UseAutocompleteProps<TQueryFnData, TError, TData> & {
    name: TName;
    resource: string;
    children?: JSX.Element;
    required?: boolean;
    rules?: UseControllerProps["rules"];
};

type ReferenceArrayElementComponent = <
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
    TQueryFnData extends BaseRecord = any,
    TError extends HttpError = HttpError,
    TData extends BaseRecord = TQueryFnData
>(
    props: ReferenceArrayElementProps<
        TFieldValues,
        TName,
        TQueryFnData,
        TError,
        TData
    >
) => JSX.Element;

const ReferenceArrayElement = <
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
    TQueryFnData extends BaseRecord = any,
    TError extends HttpError = HttpError,
    TData extends BaseRecord = TQueryFnData
>(
    props: ReferenceArrayElementProps<
        TFieldValues,
        TName,
        TQueryFnData,
        TError,
        TData
    >
) => {
    const {
        name,
        resource,
        children = defaultChildren,
        pagination = {
            pageSize: 25,
            current: 1,
            mode: "server",
        },
        required,
        rules,
        searchField = "name",
        ...rest
    } = props;

    if (React.Children.count(children) !== 1) {
        throw new Error("<ReferenceArrayElement> only accepts a single child");
    }
    const isAutoCompleteType =
        children.type == AutocompleteArrayElement ||
        children.type == AutocompleteElement;

    const fieldValue = useWatch({ name: name! });
    const { autocompleteProps, onSearch } = useAutocomplete<
        TQueryFnData,
        TError,
        TData
    >({
        resource: resource,
        pagination,
        ...(isAutoCompleteType && { defaultValue: fieldValue }),
        searchField: searchField as keyof TData extends string
            ? keyof TData
            : never,
        selectedOptionsOrder: "selected-first",
        ...rest,
    });

    return React.cloneElement(children as React.ReactElement, {
        options: autocompleteProps.options,
        ...(isAutoCompleteType && { onSearch }),
        name,
        required,
        rules,
    });
};
const defaultChildren = <AutocompleteArrayElement />;
ReferenceArrayElement.displayName = "ReferenceArrayElement";
export default ReferenceArrayElement as ReferenceArrayElementComponent;
