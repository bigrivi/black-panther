import {
    ConfirmDialog as DeleteActionConfirmDialog,
    Paper,
} from "@/components";
import { RefineListView } from "@/components/refine-list-view";
import { useTable } from "@/hooks";
import { IAction, IResource } from "@/interfaces";
import { Add } from "@mui/icons-material";
import {
    IconButton,
    Stack,
    Table,
    TableBody,
    TableContainer,
} from "@mui/material";
import { BaseKey, useCan, useDelete, useTranslate } from "@refinedev/core";
import { MaterialReactTable, MRT_ColumnDef } from "material-react-table";
import { PropsWithChildren, useMemo, useState } from "react";
import { ActionDrawerForm } from "./components/drawer-action-form ";
import { ActionRows } from "./components/list/ActionRows";
import { ResourceDropdown } from "./components/list/ResourceDropdown";

export const ResourceList = ({ children }: PropsWithChildren) => {
    const t = useTranslate();
    const { mutateAsync } = useDelete();
    const [actionDrawerOpen, setActionDrawerOpen] = useState(false);
    const [actionResourceId, setActionResourceId] = useState<BaseKey>();
    const [actionRemoveDialogVisible, setActionRemoveDialogVisible] =
        useState(false);
    const [action, setAction] = useState<IAction>();
    const [actionDrawerMode, setActionDrawerMode] = useState<
        "create" | "edit"
    >();
    const { data: canCreateAction } = useCan({
        resource: "resource",
        action: "create-action",
    });

    const columns = useMemo<MRT_ColumnDef<IResource>[]>(
        () => [
            {
                accessorKey: "name",
                header: t("resources.fields.name"),
                size: 300,
                grow: 0,
            },
            {
                accessorKey: "key",
                header: t("resources.fields.key.label"),
                width: 200,
            },

            {
                accessorKey: "actions",
                header: t("table.actions"),
                enableColumnFilter: false,
                enableSorting: false,
                enableHiding: false,
                muiTableHeadCellProps: {
                    align: "center",
                },
                muiTableBodyCellProps: {
                    align: "center",
                },
                size: 250,
                grow: 0,
                Cell: function render({ row }) {
                    return (
                        <Stack alignItems="center" direction={"row"}>
                            {canCreateAction?.can && (
                                <IconButton
                                    size="small"
                                    onClick={() => {
                                        handleAddAction(row.original);
                                    }}
                                >
                                    <Add />
                                </IconButton>
                            )}

                            <ResourceDropdown resource={row.original} />
                        </Stack>
                    );
                },
            },
        ],
        [t, canCreateAction]
    );

    const {
        refineCore: { tableQuery },
        ...table
    } = useTable({
        columns,
        enableRowNumbers: false,
        displayColumnDefOptions: {
            "mrt-row-expand": {
                size: 1,
                grow: 0,
            },
        },
        muiDetailPanelProps: {
            sx: {
                padding: 0,
                "& .MuiCollapse-root": {
                    width: "100%",
                },
            },
        },
        enableExpandAll: false,
        muiExpandButtonProps: ({ row, table }) => ({
            onClick: () =>
                table.setExpanded({ [row.id]: !row.getIsExpanded() }),

            sx: {
                transform: row.getIsExpanded()
                    ? "rotate(180deg)"
                    : "rotate(-90deg)",

                transition: "transform 0.2s",
            },
        }),

        renderDetailPanel: ({ row }) => {
            return (
                <TableContainer sx={{ width: "100%" }}>
                    <Table>
                        <TableBody>
                            <ActionRows
                                resource={row.original}
                                onEdit={(action) =>
                                    handleEditAction(row.original, action)
                                }
                                onDelete={(action) => {
                                    handleDeleteAction(row.original, action);
                                }}
                                actions={row.original.actions!}
                            />
                        </TableBody>
                    </Table>
                </TableContainer>
            );
        },
    });

    const handleAddAction = (resource: IResource) => {
        setActionDrawerOpen(true);
        setActionResourceId(resource.id);
        setActionDrawerMode("create");
        setAction(undefined);
    };

    const handleEditAction = (resource: IResource, action: IAction) => {
        setActionDrawerOpen(true);
        setActionResourceId(resource.id);
        setActionDrawerMode("edit");
        setAction(action);
    };

    const handleDeleteAction = (resource: IResource, action: IAction) => {
        setActionResourceId(resource.id);
        setAction(action);
        setActionRemoveDialogVisible(true);
    };

    const doDeleteAction = async () => {
        await mutateAsync(
            {
                id: action!.id,
                resource: `resource/${actionResourceId}/action`,
            },
            { onSuccess: () => tableQuery.refetch() }
        );
    };

    return (
        <RefineListView>
            <Paper>
                <MaterialReactTable table={table} />
            </Paper>
            {children}
            {actionResourceId && actionDrawerOpen && (
                <ActionDrawerForm
                    open={actionDrawerOpen}
                    resourceId={actionResourceId}
                    action={actionDrawerMode!}
                    id={action?.id}
                    onClose={() => {
                        setActionDrawerOpen(false);
                        setActionResourceId(undefined);
                    }}
                    onMutationSuccess={() => {
                        setActionDrawerOpen(false);
                        setActionResourceId(undefined);
                        setAction(undefined);
                        tableQuery.refetch();
                    }}
                />
            )}
            <DeleteActionConfirmDialog
                title={t("resourceActions.actions.delete.confirm.title")}
                message={t("resourceActions.actions.delete.confirm.message", {
                    action: action?.name,
                })}
                onConfirm={doDeleteAction}
                open={actionRemoveDialogVisible}
                onClose={() => {
                    setActionRemoveDialogVisible(false);
                    setAction(undefined);
                }}
            ></DeleteActionConfirmDialog>
        </RefineListView>
    );
};
