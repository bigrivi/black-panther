import { DeleteButton, Paper } from "@/components";
import { RefineListView } from "@/components/refine-list-view";
import { Status } from "@/components/status";
import { defaultDataTimeFormat } from "@/constants";
import { useTable } from "@/hooks";
import { IRole } from "@/interfaces";
import { useTranslate } from "@refinedev/core";
import {
    CreateButton,
    DateField,
    EditButton,
    RefreshButton,
} from "@refinedev/mui";
import { MaterialReactTable, MRT_ColumnDef } from "material-react-table";
import { PropsWithChildren, useMemo } from "react";

export const RoleList = ({ children }: PropsWithChildren) => {
    const t = useTranslate();

    const columns = useMemo<MRT_ColumnDef<IRole>[]>(
        () => [
            {
                accessorKey: "name",
                header: t("roles.fields.name"),
                size: 200,
            },
            {
                accessorKey: "code",
                header: t("roles.fields.code"),
                width: 200,
            },
            {
                accessorKey: "created_at",
                accessorFn: (row) => new Date(row.created_at),
                header: t("fields.createdAt"),
                size: 200,
                filterFn: "between",
                filterVariant: "datetime-range",
                Cell: function render({ row }) {
                    return (
                        <DateField
                            value={row.original.created_at}
                            format={defaultDataTimeFormat}
                        />
                    );
                },
            },
            {
                accessorKey: "valid_state",
                enableColumnFilterModes: false,
                filterSelectOptions: [
                    {
                        label: t(`fields.status.true`),
                        value: "1",
                    },
                    {
                        label: t(`fields.status.false`),
                        value: "0",
                    },
                ],
                filterVariant: "select",
                header: t("fields.status.label"),
                glow: true,
                Cell: ({ row }) => {
                    return <Status value={row.original.valid_state!} />;
                },
            },
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
        ],
        [t]
    );

    const {
        refineCore: { tableQuery },
        ...table
    } = useTable({
        columns,
        enableColumnPinning: true,
        enableRowSelection: (row) => row.original.code !== "admin",
        getRowId: (originalRow) => {
            return originalRow.id + "";
        },
        initialState: { columnPinning: { right: ["actions"] } },
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
