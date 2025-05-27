import { Paper } from "@/components";
import { RefineListView } from "@/components/refine-list-view";
import { Status } from "@/components/status";
import { defaultDataTimeFormat } from "@/constants";
import { IDepartment } from "@/interfaces";
import { getTreeExpandAllNodeIds } from "@/utils/tree";
import {
    Add,
    ChevronRightOutlined,
    Compress,
    Expand,
    ExpandMoreOutlined,
} from "@mui/icons-material";
import {
    Box,
    Button,
    IconButton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import { useGo, useList, useTranslate } from "@refinedev/core";
import {
    CreateButton,
    DateField,
    DeleteButton,
    EditButton,
    RefreshButton,
} from "@refinedev/mui";
import {
    Fragment,
    PropsWithChildren,
    useEffect,
    useMemo,
    useState,
} from "react";

const INDENT_WIDTH = 24;

export const DeptList = ({ children }: PropsWithChildren) => {
    const t = useTranslate();
    const go = useGo();
    const [expandAll, setExpandAll] = useState(false);
    const [expandedRowKeys, setExpandedRowKeys] = useState<number[]>([]);
    const { data: deptData, refetch } = useList<IDepartment>({
        pagination: {
            mode: "off",
        },
        meta: {
            isTree: true,
        },
    });

    const rows = useMemo(() => {
        return deptData?.data || [];
    }, [deptData]);

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

    const handleExpandClick = () => {
        setExpandAll(!expandAll);
    };

    useEffect(() => {
        if (expandAll) {
            setExpandedRowKeys(getTreeExpandAllNodeIds<number>(rows));
        } else {
            setExpandedRowKeys([]);
        }
    }, [expandAll]);

    const renderChildren = (children: IDepartment[] = [], depth: number) => {
        return children.map((item) => {
            const itemChildren = item.children;
            const hasChildren = !!(itemChildren && itemChildren.length);
            const isExpanded = expandedRowKeys.includes(item.id);
            return (
                <Fragment key={item.id}>
                    <TableRow hover>
                        <TableCell
                            align={"left"}
                            style={{
                                minWidth: 200,
                                width: 200,
                                zIndex: 100,
                            }}
                        >
                            <Box
                                display={"flex"}
                                alignItems={"center"}
                                style={{ paddingLeft: depth * INDENT_WIDTH }}
                            >
                                {hasChildren && (
                                    <IconButton
                                        size="small"
                                        style={{ padding: 0, marginLeft: -10 }}
                                        onClick={(evt) => {
                                            evt.stopPropagation();
                                            toggleRowExpanded(item.id);
                                        }}
                                    >
                                        {isExpanded && <ExpandMoreOutlined />}
                                        {!isExpanded && (
                                            <ChevronRightOutlined />
                                        )}
                                    </IconButton>
                                )}
                                {item.name}
                            </Box>
                        </TableCell>
                        <TableCell align={"left"}>
                            <DateField
                                value={item.created_at}
                                format={defaultDataTimeFormat}
                            />
                        </TableCell>
                        <TableCell align={"left"}>
                            <Status value={item.valid_state!} />
                        </TableCell>
                        <TableCell align={"left"}>
                            <Stack direction="row">
                                <IconButton
                                    onClick={() => {
                                        go({
                                            to: "/departments/create",
                                            query: {
                                                parent_id: item.id,
                                            },
                                        });
                                    }}
                                    size="small"
                                >
                                    <Add color="primary" />
                                </IconButton>
                                <EditButton hideText recordItemId={item.id} />
                                {depth > 0 && (
                                    <DeleteButton
                                        hideText
                                        recordItemId={item.id}
                                    />
                                )}
                            </Stack>
                        </TableCell>
                    </TableRow>
                    {hasChildren &&
                        isExpanded &&
                        renderChildren(itemChildren, depth + 1)}
                </Fragment>
            );
        });
    };

    return (
        <>
            <RefineListView
                headerButtons={(props) => {
                    return [
                        <CreateButton key={"create"} />,
                        <Button
                            key={"expand"}
                            onClick={handleExpandClick}
                            startIcon={expandAll ? <Compress /> : <Expand />}
                            size="small"
                        >
                            {expandAll ? "Collapse" : "Expand"}
                        </Button>,
                        <RefreshButton
                            onClick={() => refetch()}
                            key={"refresh"}
                        />,
                    ];
                }}
            >
                <Paper>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell
                                        align={"left"}
                                        style={{
                                            minWidth: 300,
                                            width: 300,
                                        }}
                                    >
                                        Name
                                    </TableCell>
                                    <TableCell align={"left"}>
                                        {t("orders.fields.createdAt")}
                                    </TableCell>
                                    <TableCell align={"left"}>
                                        {t("fields.status.label")}
                                    </TableCell>
                                    <TableCell
                                        style={{
                                            minWidth: 200,
                                            width: 200,
                                        }}
                                        align={"left"}
                                    >
                                        {t("table.actions")}
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>{renderChildren(rows, 0)}</TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </RefineListView>
            {children}
        </>
    );
};
