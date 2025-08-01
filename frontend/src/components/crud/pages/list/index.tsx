import { DeleteButton, Paper } from "@/components";
import { RefineListView } from "@/components/refine-list-view";
import { useTable } from "@/hooks";
import { useCustom, useResource, useTranslate } from "@refinedev/core";
import { CreateButton, EditButton, RefreshButton } from "@refinedev/mui";
import { MaterialReactTable, MRT_ColumnDef } from "material-react-table";
import { PropsWithChildren, useMemo } from "react";
import { columnDefFactory } from "./column-factory";

export const List = ({ children }: PropsWithChildren) => {
    const t = useTranslate();
    const { resource } = useResource();
    const { data: listSchemaData } = useCustom<any>({
        url: `schema/${resource?.name}`,
        method: "get",
        config: {
            query: { type: "list" },
        },
    });

    const listSchema = useMemo(() => {
        if (listSchemaData?.data) {
            const { properties } = listSchemaData.data;
            return Object.keys(properties)
                .filter((key) => !!properties[key].valueType)
                .filter((key) => !properties[key].hideInList)
                .sort((a, b) => {
                    const p1 = properties[a].priority ?? 0;
                    const p2 = properties[b].priority ?? 0;
                    return p2 - p1;
                })
                .map((key) => {
                    return {
                        name: key,
                        ...properties[key],
                    };
                });
        }
        return [];
    }, [listSchemaData]);

    const columns = useMemo<MRT_ColumnDef<any>[]>(() => {
        return [
            ...listSchema.map(
                (schema): MRT_ColumnDef<any> => columnDefFactory(schema)
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
