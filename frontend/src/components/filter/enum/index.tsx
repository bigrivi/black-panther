import { propertyExists } from "@/utils/common";
import { Autocomplete, TextField } from "@mui/material";
import { useAutocomplete } from "@refinedev/mui";
import { MRT_Header, MRT_RowData } from "material-react-table";
import { FC } from "react";

export type EnumFilterProps<TData extends MRT_RowData> = {
    header: MRT_Header<TData>;
    enumKey: string;
};

export const EnumFilter: FC<EnumFilterProps<any>> = ({ header, enumKey }) => {
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
                        total: matchedEnum.items.length,
                    };
                }
                return {
                    data: [],
                    total: 0,
                };
            },
        },
    });

    const getOptionLabel = (option): string => {
        return option["name"];
    };

    const isOptionEqualToValue = (option, value): boolean => {
        const optionKey = propertyExists(option, "id") ? option["id"] : option;
        const valueKey = propertyExists(value, "id") ? value["id"] : value;
        return optionKey === valueKey;
    };

    const matchOptionByValue = (currentValue) => {
        return autocompleteProps.options.find((option) => {
            return isOptionEqualToValue(option, currentValue);
        });
    };

    return (
        <Autocomplete
            value={matchOptionByValue(header.column.getFilterValue()) ?? null}
            getOptionLabel={getOptionLabel}
            onChange={(event, newValue) => {
                header.column.setFilterValue(newValue ? newValue["id"] : null);
            }}
            options={autocompleteProps.options}
            isOptionEqualToValue={isOptionEqualToValue}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} />}
        />
    );
};
