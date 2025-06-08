import {
    ConfirmDialog as DeleteActionConfirmDialog,
    Paper,
} from "@/components";
import { RefineListView } from "@/components/refine-list-view";
import { IAction, IResource } from "@/interfaces";
import {
    Add,
    ChevronRightOutlined,
    ExpandMoreOutlined,
} from "@mui/icons-material";
import {
    IconButton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import {
    BaseKey,
    useCan,
    useDelete,
    useList,
    useTranslate,
} from "@refinedev/core";
import { Fragment, PropsWithChildren, useMemo, useState } from "react";
import { ActionDrawerForm } from "./components/drawer-action-form ";
import { ActionRows } from "./components/list/ActionRows";
import { ResourceDropdown } from "./components/list/ResourceDropdown";

export const ResourceList = ({ children }: PropsWithChildren) => {
    const t = useTranslate();
    const { mutateAsync } = useDelete();
    const [expandedRowKeys, setExpandedRowKeys] = useState<number[]>([]);
    const { data: resourceData, refetch } = useList<IResource>({
        resource: "resource",
        pagination: { mode: "off" },
    });

    const resources = useMemo(() => {
        return resourceData?.data || [];
    }, [resourceData]);
    const [actionDrawerOpen, setActionDrawerOpen] = useState(false);
    const [actionResourceId, setActionResourceId] = useState<BaseKey>();
    const [actionRemoveDialogVisible, setActionRemoveDialogVisible] =
        useState(false);
    const [action, setAction] = useState<IAction>();
    const [actionDrawerMode, setActionDrawerMode] = useState<
        "create" | "edit"
    >();

    const toggleRowExpanded = (resourceId: number) => {
        if (expandedRowKeys.includes(resourceId)) {
            setExpandedRowKeys(
                expandedRowKeys.filter(
                    (expandRowKey) => expandRowKey != resourceId
                )
            );
        } else {
            setExpandedRowKeys([...expandedRowKeys, resourceId]);
        }
    };

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
            { onSuccess: () => refetch() }
        );
    };

    const { data: canCreateAction } = useCan({
        resource: "resource",
        action: "create-action",
    });
    const { data: canEditAction } = useCan({
        resource: "resource",
        action: "edit-action",
    });
    const { data: canDeleteAction } = useCan({
        resource: "resource",
        action: "delete-action",
    });

    return (
        <RefineListView>
            <Paper>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    align={"left"}
                                    style={{
                                        minWidth: 200,
                                        width: 200,
                                        zIndex: 100,
                                    }}
                                >
                                    {t("resources.fields.name")}
                                </TableCell>
                                <TableCell align={"left"}>
                                    {t("resources.fields.key.label")}
                                </TableCell>
                                <TableCell
                                    style={{ width: 150 }}
                                    align={"left"}
                                >
                                    {t("table.actions")}
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {resources.map((resource) => {
                                const isExpanded = expandedRowKeys.includes(
                                    resource.id
                                );
                                return (
                                    <Fragment key={resource.id}>
                                        <TableRow>
                                            <TableCell
                                                align={"left"}
                                                style={{
                                                    minWidth: 176,
                                                    width: 176,
                                                }}
                                            >
                                                <IconButton
                                                    size="small"
                                                    onClick={(evt) => {
                                                        evt.stopPropagation();
                                                        toggleRowExpanded(
                                                            resource.id
                                                        );
                                                    }}
                                                >
                                                    {isExpanded && (
                                                        <ExpandMoreOutlined />
                                                    )}
                                                    {!isExpanded && (
                                                        <ChevronRightOutlined />
                                                    )}
                                                </IconButton>

                                                <span
                                                    style={{ fontWeight: 500 }}
                                                >
                                                    {resource.name}
                                                </span>
                                            </TableCell>
                                            <TableCell align={"left"}>
                                                {resource.key}
                                            </TableCell>
                                            <TableCell
                                                style={{ width: 150 }}
                                                align={"left"}
                                            >
                                                <Stack
                                                    alignItems="center"
                                                    direction={"row"}
                                                >
                                                    {canCreateAction?.can && (
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => {
                                                                handleAddAction(
                                                                    resource
                                                                );
                                                            }}
                                                        >
                                                            <Add />
                                                        </IconButton>
                                                    )}

                                                    <ResourceDropdown
                                                        resource={resource}
                                                    />
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                        {isExpanded && (
                                            <ActionRows
                                                resource={resource}
                                                onEdit={(action) =>
                                                    handleEditAction(
                                                        resource,
                                                        action
                                                    )
                                                }
                                                onDelete={(action) => {
                                                    handleDeleteAction(
                                                        resource,
                                                        action
                                                    );
                                                }}
                                                actions={resource.actions!}
                                            />
                                        )}
                                    </Fragment>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
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
                        refetch();
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
