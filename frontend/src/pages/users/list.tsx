import { Paper } from "@/components";
import { RefineListView } from "@/components/refine-list-view";
import { IUser, IUserFilterVariables } from "@/interfaces";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { Chip } from "@mui/material";
import {
    DataGrid,
    GridActionsCellItem,
    type GridColDef,
} from "@mui/x-data-grid";
import {
    type HttpError,
    useNavigation,
    useTranslate,
    useUpdate,
} from "@refinedev/core";
import {
    CreateButton,
    DateField,
    RefreshButton,
    useDataGrid,
} from "@refinedev/mui";
import { useMemo } from "react";

export const UserList = () => {
    const t = useTranslate();
    const { mutate } = useUpdate({ resource: "orders" });

    const { dataGridProps, tableQuery } = useDataGrid<
        IUser,
        HttpError,
        IUserFilterVariables
    >({
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
                type: "actions",
                headerName: t("table.actions"),
                sortable: false,
                width: 200,
                getActions: ({ id }) => [
                    <GridActionsCellItem
                        key={1}
                        icon={<CheckOutlinedIcon color="success" />}
                        sx={{ padding: "2px 6px" }}
                        label={t("buttons.accept")}
                        showInMenu
                        onClick={() => {
                            mutate({
                                id,
                                values: {
                                    status: {
                                        id: 2,
                                        text: "Ready",
                                    },
                                },
                            });
                        }}
                    />,
                    <GridActionsCellItem
                        key={2}
                        icon={<CloseOutlinedIcon color="error" />}
                        sx={{ padding: "2px 6px" }}
                        label={t("buttons.reject")}
                        showInMenu
                        onClick={() =>
                            mutate({
                                id,
                                values: {
                                    status: {
                                        id: 5,
                                        text: "Cancelled",
                                    },
                                },
                            })
                        }
                    />,
                ],
            },
        ],
        [t, mutate]
    );

    const { show } = useNavigation();

    console.log(tableQuery.isLoading);

    return (
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
                    onRowClick={({ id }) => {
                        show("orders", id);
                    }}
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
    );
};
