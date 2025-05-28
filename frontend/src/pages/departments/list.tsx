import { Paper } from "@/components";
import { RefineListView } from "@/components/refine-list-view";
import { useTable } from "@/hooks";
import { IDepartment } from "@/interfaces";
import { Add } from "@mui/icons-material";
import { IconButton, Stack } from "@mui/material";
import { useGo, useTranslate } from "@refinedev/core";
import {
    CreateButton,
    DeleteButton,
    EditButton,
    RefreshButton,
} from "@refinedev/mui";
import { MaterialReactTable, MRT_ColumnDef } from "material-react-table";
import { PropsWithChildren, useMemo } from "react";

export const DeptList = ({ children }: PropsWithChildren) => {
    const t = useTranslate();
    const go = useGo();

    const columns = useMemo<MRT_ColumnDef<IDepartment>[]>(
        () => [
            {
                accessorKey: "name",
                header: "Department Name",
                enableSorting: false,
                grow: true,
            },
            {
                accessorKey: "actions",
                header: t("table.actions"),
                enableColumnFilter: false,
                enableSorting: false,
                size: 100,
                Cell: function render({ row }) {
                    return (
                        <Stack direction="row">
                            <IconButton
                                onClick={() => {
                                    go({
                                        to: "/departments/create",
                                        query: {
                                            parent_id: row.original.id,
                                        },
                                    });
                                }}
                                size="small"
                            >
                                <Add color="primary" />
                            </IconButton>
                            <EditButton
                                hideText
                                recordItemId={row.original.id}
                            />
                            <DeleteButton
                                hideText
                                recordItemId={row.original.id}
                            />
                        </Stack>
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
        enableExpanding: true,
        enablePagination: false,
        filterFromLeafRows: true,
        displayColumnDefOptions: {
            "mrt-row-expand": {
                size: 0,
            },
        },
        getSubRows: (originalRow) => originalRow.children,
        initialState: { columnPinning: { right: ["actions"] }, expanded: true },
        refineCoreProps: {
            meta: {
                isTree: true,
            },
            pagination: {
                mode: "off",
            },
            filters: {
                mode: "off",
            },
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
