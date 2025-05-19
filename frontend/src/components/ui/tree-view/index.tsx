import Box from "@mui/material/Box";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { FC } from "react";

export type TreeNode = {
    disabled?: boolean;
    [key: string]: any;
};

type TreeViewProps = {
    treeData: TreeNode[];
    value: string;
    fieldNames: {
        label: string;
        value: string;
        children: string;
    };
    onChange: (value: string | null) => void;
    expandedItems: string[];
    onExpandedItemsChange: (itemIds: string[]) => void;
};

export const TreeView: FC<TreeViewProps> = ({
    treeData,
    fieldNames,
    value,
    onChange,
    expandedItems,
    onExpandedItemsChange,
}) => {
    const handleExpandedItemsChange = (
        event: React.SyntheticEvent,
        itemIds: string[]
    ) => {
        onExpandedItemsChange(itemIds);
    };

    const handleSelectedItemsChange = (
        event: React.SyntheticEvent,
        itemIds: string | null
    ) => {
        var element = event.target as HTMLElement;
        if (element.tagName === "DIV") {
            onChange(itemIds);
        }
    };

    const renderChildren = (children: TreeNode[]) => {
        return (
            <>
                {children &&
                    children.map((item) => {
                        const hasChildren = !!(
                            item[fieldNames["children"]] &&
                            item[fieldNames["children"]].length
                        );
                        return (
                            <TreeItem
                                key={item[fieldNames["value"]] + ""}
                                itemId={item[fieldNames["value"]] + ""}
                                label={item[fieldNames["label"]]}
                            >
                                {hasChildren &&
                                    renderChildren(
                                        item[fieldNames["children"]]
                                    )}
                            </TreeItem>
                        );
                    })}
            </>
        );
    };

    return (
        <Box>
            <SimpleTreeView
                expansionTrigger="iconContainer"
                expandedItems={expandedItems}
                selectedItems={value}
                onExpandedItemsChange={handleExpandedItemsChange}
                onSelectedItemsChange={handleSelectedItemsChange}
            >
                {treeData && renderChildren(treeData)}
            </SimpleTreeView>
        </Box>
    );
};
