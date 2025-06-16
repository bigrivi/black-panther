import { DeleteButton, Paper } from "@/components";
import { RefineListView } from "@/components/refine-list-view";
import { defaultDataTimeFormat } from "@/constants";
import { useTable } from "@/hooks";
import { IParameter } from "@/interfaces";
import { Tooltip, Typography } from "@mui/material";
import { useTranslate } from "@refinedev/core";
import {
    CreateButton,
    DateField,
    EditButton,
    RefreshButton,
} from "@refinedev/mui";
import { MaterialReactTable, MRT_ColumnDef } from "material-react-table";
import { PropsWithChildren, useMemo } from "react";

export const ParameterList = ({ children }: PropsWithChildren) => {
    const t = useTranslate();

    const columns = useMemo<MRT_ColumnDef<IParameter>[]>(
        () => [
            {
                accessorKey: "name",
                header: t("parameterSettings.fields.name"),
                size: 200,
            },
            {
                accessorKey: "key",
                header: t("parameterSettings.fields.key"),
                width: 200,
            },
            {
                accessorKey: "value",
                header: t("parameterSettings.fields.value"),
                width: 200,
            },

            {
                accessorKey: "is_system",
                size: 250,
                enableColumnFilterModes: false,
                filterSelectOptions: [
                    {
                        label: "Yes",
                        value: "1",
                    },
                    {
                        label: "No",
                        value: "0",
                    },
                ],
                filterVariant: "select",
                header: t("parameterSettings.fields.builtIn"),
                Cell: ({ row }) => {
                    return row.original.is_system ? "Yes" : "No";
                },
            },
            {
                accessorKey: "description",
                header: t("parameterSettings.fields.description"),
                size: 200,
                Cell: function render({ row }) {
                    return (
                        <Tooltip
                            placement="top"
                            arrow
                            title={row.original.description}
                        >
                            <Typography noWrap>
                                {row.original.description}
                            </Typography>
                        </Tooltip>
                    );
                },
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
