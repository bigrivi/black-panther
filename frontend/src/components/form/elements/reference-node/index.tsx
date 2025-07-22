import { BaseRecord, useList } from "@refinedev/core";
import React from "react";
import { FieldPath, FieldValues, UseControllerProps } from "react-hook-form";
import TreeSelectFieldElement from "../tree-select";

export type ReferenceNodeElementProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
    name: TName;
    resource: string;
    children?: JSX.Element;
    required?: boolean;
    rules?: UseControllerProps["rules"];
};

type ReferenceNodeElementComponent = <
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(
    props: ReferenceNodeElementProps<TFieldValues, TName>
) => JSX.Element;

const ReferenceNodeElement = <
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
    TValue extends BaseRecord = BaseRecord
>(
    props: ReferenceNodeElementProps<TFieldValues, TName>
) => {
    const {
        name,
        resource,
        required,
        rules,
        children = defaultChildren,
    } = props;

    if (React.Children.count(children) !== 1) {
        throw new Error("<ReferenceNodeElement> only accepts a single child");
    }

    const { data } = useList<TFieldValues>({
        resource,
        meta: {
            isTree: true,
        },
    });

    return React.cloneElement(children as React.ReactElement, {
        treeData: data?.data ?? [],
        name,
        required,
        rules,
    });
};
const defaultChildren = <TreeSelectFieldElement />;
ReferenceNodeElement.displayName = "ReferenceNodeElement";
export default ReferenceNodeElement as ReferenceNodeElementComponent;
