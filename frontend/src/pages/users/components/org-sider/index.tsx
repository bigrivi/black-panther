import { TreeView } from "@/components";
import { IDepartment } from "@/interfaces";
import { getExpandNodeIds } from "@/utils/getExpandNodeIds";
import { ExpandMoreOutlined, Group, Refresh } from "@mui/icons-material";
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Divider,
    IconButton,
} from "@mui/material";
import { FC, useEffect, useState } from "react";

type OrgSiderProps = {
    onReload: () => void;
    deptTreeData: IDepartment[];
    selectedDept?: string;
    onSelectedDeptChange: (deptId: string) => void;
};
export const OrgSider: FC<OrgSiderProps> = ({
    onReload,
    deptTreeData,
    selectedDept,
    onSelectedDeptChange,
}) => {
    const [expandedItems, setExpandedItems] = useState<string[]>([]);
    const [expandAll, setExpandAll] = useState(true);

    const handleExpandClick = () => {
        setExpandAll(!expandAll);
        if (expandAll) {
            setExpandedItems([]);
        } else {
            const expandedNodeIds = deptTreeData?.flatMap((item) =>
                getExpandNodeIds(item, "path")
            );
            setExpandedItems(expandedNodeIds!.map((nodeId) => nodeId + ""));
        }
    };

    useEffect(() => {
        if (deptTreeData?.length) {
            const expandedNodeIds = deptTreeData?.flatMap((item) =>
                getExpandNodeIds(item, "path")
            );
            setExpandedItems(expandedNodeIds.map((nodeId) => nodeId + ""));
        }
    }, [deptTreeData]);

    return (
        <Card variant="outlined" sx={{ width: 300 }}>
            <CardHeader
                title={
                    <Box display="flex" alignItems="center">
                        <Group />
                        Organization
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
                        <IconButton size="small" onClick={onReload}>
                            <Refresh fontSize="small" />
                        </IconButton>
                    </>
                }
            ></CardHeader>
            <Divider />
            <CardContent
                sx={{
                    p: "32px",
                }}
            >
                <Box
                    sx={{
                        height: "calc(100vh - 270px)",
                        padding: "12px",
                        overflow: "auto",
                    }}
                >
                    <TreeView
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
                        treeData={deptTreeData}
                    />
                </Box>
            </CardContent>
        </Card>
    );
};
