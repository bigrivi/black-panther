import { Paper } from "@/components";
import { RefineListView } from "@/components/refine-list-view";
import { IUser } from "@/interfaces";
import { Chip } from "@mui/material";
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

export const UserList = ({ children }: PropsWithChildren) => {
    const t = useTranslate();

    const { dataGridProps, tableQuery } = useDataGrid<IUser>({
        initialPageSize: 10,
    });

    const columns = useMemo<GridColDef<IUser>[]>(
        () => [
            {
                field: "login_name",
                headerName: "LoginName",
                width: 150,
            },

            {
                field: "user_name",
                headerName: "UserName",
                width: 150,
            },
            {
                field: "email",
                headerName: "Email",
                width: 150,
            },
            {
                field: "roles",
                headerName: "Roles",
                sortable: false,
                flex: 1,
                renderCell: function render({ row }) {
                    return (
                        <>
                            {row.roles.map((role) => (
                                <Chip
                                    size="small"
                                    key={role.id}
                                    label={role.name}
                                />
                            ))}
                        </>
                    );
                },
            },
            {
                field: "createdAt",
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
                field: "actions",
                headerName: t("table.actions"),
                sortable: false,
                filterable: false,
                pinnable: true,
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
