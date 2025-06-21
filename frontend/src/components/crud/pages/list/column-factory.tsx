import { IFieldSchema } from "@/interfaces";
import { BooleanField } from "@refinedev/mui";
import { MRT_ColumnDef } from "material-react-table";

export const columnDefFactory = ({
    name,
    title,
    options,
    valueType,
}: IFieldSchema): MRT_ColumnDef<any> => {
    const base = {
        accessorKey: name,
        header: title,
        size: 200,
    };
    switch (valueType) {
        case "checkbox":
        case "switch":
            return {
                ...base,
                filterVariant: "checkbox",
                muiFilterCheckboxProps: {},
                enableColumnFilterModes: false,
                Cell: ({ cell }) => {
                    return <BooleanField value={cell.getValue()} />;
                },
            };
        case "select":
            return {
                ...base,
                enableColumnFilterModes: false,
                filterSelectOptions: options?.map((item) => {
                    return {
                        label: item.label,
                        value: item.value + "",
                    };
                }),
                filterVariant: "select",
                filterFn: "equals",
                Cell: ({ cell }) => {
                    return options?.find(
                        (option) => option.value == cell.getValue()
                    )?.label;
                },
            };
    }
    return base;
};
