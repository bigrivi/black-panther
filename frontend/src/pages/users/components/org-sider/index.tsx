import { TreeView } from "@/components";
import SearchInput from "@/components/ui/search-input";
import { IDepartment } from "@/interfaces";
import {
    filterTree,
    getExpandFilteredNodeIds,
    getTreeExpandAllNodeIds,
} from "@/utils/tree";
import { ExpandMoreOutlined, Group, Refresh } from "@mui/icons-material";
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Divider,
    IconButton,
    Stack,
} from "@mui/material";
import { useList, useTranslate } from "@refinedev/core";
import { FC, useCallback, useEffect, useMemo, useState } from "react";

type OrgSiderProps = {
    selectedDept?: string;
    onSelectedDeptChange: (deptId: string) => void;
};
export const OrgSider: FC<OrgSiderProps> = ({
    selectedDept,
    onSelectedDeptChange,
}) => {
    const [expandedItems, setExpandedItems] = useState<string[]>([]);
    const [expandAll, setExpandAll] = useState(true);
    const [filterText, setFilterText] = useState("");
    const t = useTranslate();

    const { data: deptTreeData, refetch } = useList<IDepartment>({
        resource: "department",
        meta: {
            isTree: true,
        },
    });

    const treeData = deptTreeData?.data ?? [];

    const handleFilter = useCallback(
        (value: string) => {
            setFilterText(value);
            if (value) {
                const expandedNodeIds = getExpandFilteredNodeIds<
                    string,
                    IDepartment
                >(treeData, value, {
                    children: "children",
                    label: "name",
                    value: "path",
                });
                console.log("expand nodes", expandedNodeIds);
                setExpandedItems(expandedNodeIds);
            } else {
                setExpandedItems([]);
            }
        },
        [treeData]
    );

    const handleExpandClick = () => {
        setExpandAll(!expandAll);
    };

    useEffect(() => {
        if (expandAll) {
            const expandedNodeIds = getTreeExpandAllNodeIds<string>(
                treeData,
                "path"
            );
            setExpandedItems(expandedNodeIds);
        } else {
            setExpandedItems([]);
        }
    }, [expandAll, treeData]);

    const filteredTree = useMemo(() => {
        if (filterText) {
            return filterTree(treeData, filterText, {
                children: "children",
                label: "name",
                value: "path",
            });
        } else {
            return treeData;
        }
    }, [treeData, filterText]);

    return (
        <Card variant="outlined" sx={{ width: "100%", borderRadius: 2 }}>
            <CardHeader
                title={
                    <Box display="flex" alignItems="center">
                        <Group />
                        {t("users.organization")}
                    </Box>
                }
                action={
                    <>
                        <IconButton onClick={handleExpandClick}>
                            {expandAll && <ExpandMoreOutlined />}

                            {!expandAll && (
                                <ExpandMoreOutlined
                                    style={{ transform: "rotate(180deg)" }}
                                />
                            )}
                        </IconButton>
                        <IconButton size="small" onClick={() => refetch()}>
                            <Refresh fontSize="small" />
                        </IconButton>
                    </>
                }
            ></CardHeader>
            <Divider />
            <CardContent>
                <Stack
                    sx={{
                        height: "calc(100vh - 270px)",
                        padding: "12px",
                    }}
                >
                    <SearchInput
                        value={filterText}
                        placeholder={t("search.placeholder")}
                        onChange={handleFilter}
                    />
                    <Box
                        sx={{
                            flex: 1,
                            marginTop: 1,
                            overflow: "auto",
                        }}
                    >
                        <TreeView
                            filterText={filterText}
                            expandedItems={expandedItems}
                            onExpandedItemsChange={setExpandedItems}
                            fieldNames={{
                                label: "name",
                                value: "path",
                                children: "children",
                            }}
                            value={selectedDept as string}
                            onChange={(value) => {
                                onSelectedDeptChange(value as string);
                            }}
                            treeData={filteredTree}
                        />
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
};
