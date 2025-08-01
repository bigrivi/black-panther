import { IFieldSchema, Schema } from "@/interfaces";
import { useMemo } from "react";
import { UseFormReturn } from "react-hook-form";
import { Form, FormItem } from "../form";
import { fieldFactory } from "./field-factory";

interface SchemaFormProps {
    formContext?: UseFormReturn;
    schema: Schema;
}

const getRefSchema = (ref: string, schemaDefs: object) => {
    return schemaDefs[ref.split("/").pop()!];
};

export const SchemaForm: React.FC<SchemaFormProps> = ({
    formContext,
    schema,
}) => {
    const fields = useMemo(() => {
        return Object.keys(schema.properties)
            .sort((a, b) => {
                const p1 = schema.properties[a].priority ?? 0;
                const p2 = schema.properties[b].priority ?? 0;
                return p2 - p1;
            })
            .map((key): IFieldSchema => {
                const propertyData = schema?.properties[key];
                const isArray = propertyData.type == "array";
                return {
                    ...propertyData,
                    ...(isArray && {
                        valueType: propertyData.valueType ?? "listTable",
                        schema: getRefSchema(
                            propertyData.items!.$ref,
                            schema.$defs!
                        ),
                    }),
                    name: key,
                };
            });
    }, [schema]);

    return (
        <Form formContext={formContext}>
            {fields.map((field) => {
                return (
                    <FormItem
                        key={field.name}
                        label={field.title}
                        required={schema.required?.includes(field.name)}
                        htmlFor={field.name}
                    >
                        {fieldFactory(field)}
                    </FormItem>
                );
            })}
        </Form>
    );
};
