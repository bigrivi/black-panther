import { ReferenceNodeFilter } from "@/components/filter";
import { IFieldSchema } from "@/interfaces";
import { BooleanField } from "@refinedev/mui";
import { MRT_ColumnDef } from "material-react-table";

export const columnDefFactory = ({
    name,
    title,
    options,
    valueType,
    reference,
    search_key,
}: IFieldSchema): MRT_ColumnDef<any> => {
    const base = {
        accessorKey: search_key || name,
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
        case "treeSelect":
            return {
                ...base,
                enableColumnFilterModes: false,
                filterFn: "equals",
                Filter: ({ header }) => (
                    <ReferenceNodeFilter
                        header={header}
                        resource={reference!}
                    />
                ),
                Cell: ({ row }) => {
                    return row.original[name].name;
                },
            };
    }
    return base;
};
