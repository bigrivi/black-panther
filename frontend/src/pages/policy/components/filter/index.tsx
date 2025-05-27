import { Search } from "@mui/icons-material";
import {
    AutocompleteProps,
    Autocomplete as MUIAutoComplete,
    styled,
    TextField,
} from "@mui/material";
import { FC, SyntheticEvent, useMemo } from "react";
import { usePolicyProviderContext } from "../../context";
type FilterProps = {
    onChange: (value: string[]) => void;
};

type AutocompleteValue = { group: string; label: string; value: string };

export const Autocomplete = styled(
    ({ ...rest }: AutocompleteProps<AutocompleteValue, true, false, false>) => {
        return <MUIAutoComplete {...rest} />;
    }
)(({ theme }) => ({
    [`& .MuiAutocomplete-inputRoot .MuiAutocomplete-endAdornment .MuiAutocomplete-popupIndicator`]:
        {
            transform: "none",
        },
    ["& .MuiInputBase-root"]: {
        paddingTop: "0px !important",
        paddingBottom: "0px !important",
    },
    ["& .MuiChip-root"]: {
        maxHeight: 24,
        fontSize: 12,
    },
}));

export const Filter: FC<FilterProps> = ({ onChange }) => {
    const { resources, roles } = usePolicyProviderContext();
    const handleChange = (
        event: SyntheticEvent,
        value: AutocompleteValue[]
    ) => {
        onChange(value.map((item) => item.value));
        console.log(value);
    };
    const options = useMemo(() => {
        if (resources && roles) {
            return [
                ...roles.map((item) => {
                    return {
                        group: "Roles",
                        label: item.name,
                        value: "role_" + item.id,
                    };
                }),
                ...resources.map((item) => {
                    return {
                        group: "Resources",
                        label: item.name,
                        value: "resource_" + item.id,
                    };
                }),
            ];
        }
        return [];
    }, [resources, roles]);
    return (
        <Autocomplete
            multiple
            limitTags={3}
            onChange={handleChange}
            options={options}
            popupIcon={<Search />}
            groupBy={(option) => option.group}
            getOptionLabel={(option) => option.label}
            sx={{ width: 500 }}
            renderInput={(params) => {
                return (
                    <TextField
                        variant="outlined"
                        label={null}
                        placeholder="Filter Policies"
                        {...params}
                    />
                );
            }}
        />
    );
};
