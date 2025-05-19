import { Paper } from "@/components";
import { RefineListView } from "@/components/refine-list-view";
import { Status } from "@/components/status";
import { IRole } from "@/interfaces";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useTranslate } from "@refinedev/core";
import {
    CreateButton,
    DateField,
    DeleteButton,
    EditButton,
    RefreshButton,
    useDataGrid,
} from "@refinedev/mui";
import { PropsWithChildren, useMemo } from "react";

export const RoleList = ({ children }: PropsWithChildren) => {
    const t = useTranslate();

    const { dataGridProps, tableQuery } = useDataGrid<IRole>({
        initialPageSize: 10,
    });

    const columns = useMemo<GridColDef<IRole>[]>(
        () => [
            {
                field: "name",
                headerName: "Role name",
                width: 200,
            },

            {
                field: "code",
                headerName: "Role code",
                width: 200,
            },
            {
                field: "description",
                headerName: "Description",
                width: 150,
            },

            {
                field: "created_at",
                headerName: t("orders.fields.createdAt"),
                width: 200,
                display: "flex",
                renderCell: function render({ row }) {
                    return (
                        <DateField
                            value={row.created_at}
                            format="LL / hh:mm a"
                        />
                    );
                },
            },
            {
                field: "valid_state",
                headerName: t("fields.status.label"),
                width: 150,
                display: "flex",
                type: "boolean",
                renderCell: function render({ row }) {
                    return <Status value={row.valid_state!} />;
                },
            },
            {
                field: "actions",
                headerName: t("table.actions"),
                sortable: false,
                filterable: false,
                align: "center",
                headerAlign: "center",
                display: "flex",
                width: 200,
                renderCell: function render({ row }) {
                    return (
                        <>
                            <EditButton hideText recordItemId={row.id} />
                            <DeleteButton hideText recordItemId={row.id} />
                        </>
                    );
                },
            },
        ],
        [t]
    );

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
                    <DataGrid
                        {...dataGridProps}
                        columns={columns}
                        pageSizeOptions={[10, 20, 50, 100]}
                        sx={{
                            "&.MuiDataGrid-root": {
                                border: "0px solid !important",
                            },
                            "& .MuiDataGrid-row": {
                                cursor: "pointer",
                            },
                        }}
                    />
                </Paper>
            </RefineListView>
            {children}
        </>
    );
};
