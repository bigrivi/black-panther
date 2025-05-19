import { Paper } from "@/components";
import { RefineListView } from "@/components/refine-list-view";
import { Status } from "@/components/status";
import { IDepartment, IUser } from "@/interfaces";
import { Box, Chip, Stack } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useList, useTranslate } from "@refinedev/core";
import {
    CreateButton,
    DateField,
    DeleteButton,
    EditButton,
    RefreshButton,
    useDataGrid,
} from "@refinedev/mui";
import { PropsWithChildren, useMemo, useState } from "react";
import { OrgSider } from "./components/org-sider";

export const UserList = ({ children }: PropsWithChildren) => {
    const t = useTranslate();
    const [selectedDeptId, setSelectedDeptId] = useState<string>("");
    const { dataGridProps, tableQuery, setFilters, filters } =
        useDataGrid<IUser>({
            initialPageSize: 10,
            syncWithLocation: true,
        });

    const { data: deptTreeData, refetch } = useList<IDepartment>({
        resource: `dept`,
        meta: {
            isTree: true,
        },
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
                field: "department",
                headerName: "Department",
                sortable: false,
                flex: 1,
                minWidth: 150,
                renderCell: function render({ row }) {
                    return row.department?.name ?? "";
                },
            },
            {
                field: "roles",
                headerName: "Roles",
                sortable: false,
                flex: 1,
                minWidth: 200,
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
                field: "is_active",
                headerName: t("users.fields.isActive.label"),
                width: 150,
                display: "flex",
                type: "boolean",
                renderCell: function render({ row }) {
                    return <Status value={row.is_active!} />;
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

    const handleSelectedDeptIdChange = (deptId: string) => {
        console.log("onChange", deptId);
        if (deptId != selectedDeptId) {
            setSelectedDeptId(deptId);
            setFilters([
                {
                    field: "department.path",
                    value: deptId,
                    operator: "startswiths",
                },
            ]);
        } else {
            setSelectedDeptId("");
            setFilters([
                {
                    field: "department.path",
                    value: undefined,
                    operator: "startswiths",
                },
            ]);
        }
    };

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
                <Stack spacing={2} direction="row">
                    <OrgSider
                        onReload={refetch}
                        deptTreeData={deptTreeData?.data ?? []}
                        selectedDept={selectedDeptId}
                        onSelectedDeptChange={handleSelectedDeptIdChange}
                    />
                    <Box sx={{ flex: 1, overflow: "auto" }}>
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
                    </Box>
                </Stack>
            </RefineListView>
            {children}
        </>
    );
};
