import { propertyExists } from "@/utils/common";
import { Autocomplete, TextField } from "@mui/material";
import { BaseKey } from "@refinedev/core";
import { useAutocomplete } from "@refinedev/mui";
import { MRT_Header, MRT_RowData } from "material-react-table";
import { FC } from "react";

export type ReferenceFilterProps<TData extends MRT_RowData> = {
    header: MRT_Header<TData>;
    resource: string;
    searchField?: string;
    optionLabel?: string;
    optionValue?: string;
};

export const ReferenceFilter: FC<ReferenceFilterProps<any>> = ({
    header,
    resource,
    searchField = "name",
    optionLabel = "name",
    optionValue = "id",
}) => {
    const { autocompleteProps, onSearch } = useAutocomplete({
        resource: resource,
        pagination: {
            pageSize: 25,
            current: 1,
            mode: "server",
        },
        defaultValue: (header.column.getFilterValue() as BaseKey) ?? undefined,
        searchField,
        selectedOptionsOrder: "selected-first",
    });

    const getOptionLabel = (option): string => {
        return option[optionLabel];
    };

    const isOptionEqualToValue = (option, value): boolean => {
        const optionKey = propertyExists(option, optionValue)
            ? option[optionValue]
            : option;
        const valueKey = propertyExists(value, optionValue)
            ? value[optionValue]
            : value;
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
            onInputChange={(event, value, reason) => {
                if (event?.type === "change") {
                    onSearch && onSearch(value);
                } else if (event?.type === "click") {
                    onSearch && onSearch("");
                }
            }}
            options={autocompleteProps.options}
            isOptionEqualToValue={isOptionEqualToValue}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} />}
        />
    );
};
