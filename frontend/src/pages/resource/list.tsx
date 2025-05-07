import {
    BaseKey,
    HttpError,
    useCan,
    useDelete,
    useGo,
    useList,
    useTranslate,
} from "@refinedev/core";
import {
    Fragment,
    PropsWithChildren,
    useEffect,
    useMemo,
    useState,
} from "react";
import { IAction, IResource } from "@/interfaces";
import { RefineListView } from "@/components/refine-list-view";
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
    Add,
    ChevronRightOutlined,
    ExpandMoreOutlined,
    MoreHorizOutlined,
} from "@mui/icons-material";
import { Paper } from "@/components";
import { ActionRows } from "./components/list/ActionRows";
import { ActionDrawerForm } from "./components/drawer-action-form ";
import { ResourceDropdown } from "./components/list/ResourceDropdown";

export const ResourceList = ({ children }: PropsWithChildren) => {
    const t = useTranslate();
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
    const [actionId, setActionId] = useState<BaseKey>();
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
                                    Resource
                                </TableCell>
                                <TableCell align={"left"}>Key</TableCell>
                                <TableCell
                                    style={{ width: 150 }}
                                    align={"center"}
                                ></TableCell>
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
                                                align={"center"}
                                            >
                                                <Stack direction={"row"}>
                                                    {canCreateAction?.can && (
                                                        <IconButton
                                                            size="small"
                                                            color="primary"
                                                            onClick={() => {
                                                                setActionDrawerOpen(
                                                                    true
                                                                );
                                                                setActionResourceId(
                                                                    resource.id
                                                                );
                                                                setActionDrawerMode(
                                                                    "create"
                                                                );
                                                                setActionId(
                                                                    undefined
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

                                                {/* <EditButton
                                                        hideText
                                                        size="small"
                                                        recordItemId={
                                                            resource.id
                                                        }
                                                    />
                                                    <DeleteButton
                                                        hideText
                                                        size="small"
                                                        recordItemId={
                                                            resource.id
                                                        }
                                                    /> */}
                                            </TableCell>
                                        </TableRow>
                                        {isExpanded && (
                                            <ActionRows
                                                resource={resource}
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
            {actionResourceId && (
                <ActionDrawerForm
                    open={actionDrawerOpen}
                    resourceId={actionResourceId}
                    action={actionDrawerMode!}
                    id={actionId}
                    onClose={() => {
                        setActionDrawerOpen(false);
                        setActionResourceId(undefined);
                    }}
                    onMutationSuccess={() => {
                        setActionDrawerOpen(false);
                        refetch();
                    }}
                />
            )}
        </RefineListView>
    );
};
