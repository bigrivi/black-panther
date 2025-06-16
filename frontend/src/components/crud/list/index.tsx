import { DeleteButton, Paper } from "@/components";
import { RefineListView } from "@/components/refine-list-view";
import { useTable } from "@/hooks";
import { ISchema } from "@/interfaces";
import { useCustom, useResource, useTranslate } from "@refinedev/core";
import {
    BooleanField,
    CreateButton,
    EditButton,
    RefreshButton,
} from "@refinedev/mui";
import { MaterialReactTable, MRT_ColumnDef } from "material-react-table";
import { PropsWithChildren, useMemo } from "react";

export const CrudList = ({ children }: PropsWithChildren) => {
    const t = useTranslate();
    const { resource } = useResource();
    const { data: listSchemaData } = useCustom<ISchema[]>({
        url: `schema/${resource?.name}`,
        method: "get",
        config: {
            query: { type: "list" },
        },
    });

    const listSchema = useMemo(() => {
        return listSchemaData?.data ?? [];
    }, [listSchemaData]);

    const columns = useMemo<MRT_ColumnDef<any>[]>(() => {
        return [
            ...listSchema.map(
                ({ name, label, options, widget }): MRT_ColumnDef<any> => {
                    const columnDef: MRT_ColumnDef<any> = {
                        accessorKey: name,
                        header: label,
                        size: 200,
                    };
                    if (widget == "select") {
                        Object.assign(columnDef, {
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
                        });
                    } else if (widget == "switch") {
                        Object.assign(columnDef, {
                            filterVariant: "checkbox",
                            muiFilterCheckboxProps: {},
                            enableColumnFilterModes: false,
                            Cell: ({ cell }) => {
                                return <BooleanField value={cell.getValue()} />;
                            },
                        });
                    }
                    return columnDef;
                }
            ),
            {
                accessorKey: "actions",
                header: t("table.actions"),
                enableColumnFilter: false,
                enableSorting: false,
                size: 150,
                Cell: function render({ row }) {
                    return (
                        <>
                            <EditButton
                                hideText
                                recordItemId={row.original.id}
                            />
                            <DeleteButton
                                hideText
                                recordItemId={row.original.id}
                            />
                        </>
                    );
                },
            },
        ];
    }, [t, listSchema]);

    const {
        refineCore: { tableQuery },
        ...table
    } = useTable({
        columns,
        enableColumnPinning: true,
        enableRowSelection: (row) => true,
        getRowId: (originalRow) => {
            return originalRow.id + "";
        },
        initialState: {
            columnPinning: { right: ["actions"] },
            showColumnFilters: true,
        },
    });

    return (
        <>
            <RefineListView
                headerButtons={(props) => {
                    return [
                        <CreateButton key={"create"} />,
                        <RefreshButton
                            onClick={() => tableQuery.refetch()}
                            key={"refresh"}
                        />,
                    ];
                }}
            >
                <Paper>
                    <MaterialReactTable table={table} />
                </Paper>
            </RefineListView>
            {children}
        </>
    );
};
