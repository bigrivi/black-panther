import { useAutocomplete } from "@refinedev/mui";
import { FieldPath, FieldValues, UseControllerProps } from "react-hook-form";
import AutocompleteElement from "../autocomplete";

export type EnumSelectElementProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
    name: TName;
    enumKey: string;
    required?: boolean;
    rules?: UseControllerProps["rules"];
};

const EnumSelectElement = <
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(
    props: EnumSelectElementProps<TFieldValues, TName>
) => {
    const { name, required, rules, enumKey } = props;

    const { autocompleteProps } = useAutocomplete({
        resource: "enum",
        filters: [
            {
                field: "key",
                operator: "eq",
                value: enumKey,
            },
        ],
        queryOptions: {
            select: (data) => {
                if (data.data.length) {
                    const matchedEnum = data.data[0];
                    return {
                        data: matchedEnum.items,
                        total: matchedEnum.items?.length,
                    };
                }
                return {
                    data: [],
                    total: 0,
                };
            },
        },
    });

    return (
        <AutocompleteElement
            options={autocompleteProps.options}
            name={name}
            required={required}
            rules={rules}
        />
    );
};
export default EnumSelectElement;
