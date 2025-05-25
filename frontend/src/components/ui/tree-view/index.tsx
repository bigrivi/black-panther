import { hasChildren } from "@/utils/tree";
import Box from "@mui/material/Box";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";

export type TreeNode = {
    disabled?: boolean;
    [key: string]: any;
};

type FieldNames<T> = {
    label: T;
    value: T;
    children: T;
};

type TreeViewProps<T extends TreeNode> = {
    filterText?: string;
    treeData: T[];
    value: string;
    fieldNames: FieldNames<keyof T>;
    onChange: (value: string | null) => void;
    expandedItems: string[];
    onExpandedItemsChange: (itemIds: string[]) => void;
};

export const TreeView = <T extends TreeNode>({
    treeData,
    fieldNames,
    value,
    onChange,
    filterText,
    expandedItems,
    onExpandedItemsChange,
}: TreeViewProps<T>) => {
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

    const renderTreeItem = (nodes: T[]) => {
        if (!nodes) {
            return null;
        }
        return nodes.map((item) => {
            const existChildren = hasChildren(item, fieldNames);
            const matches = match(item[fieldNames["label"]], filterText, {
                insideWords: true,
            });
            const parts = parse(item[fieldNames["label"]], matches);
            const labels = parts.map((part, index) => (
                <span
                    key={index}
                    style={{
                        background: part.highlight ? "yellow" : "none",
                    }}
                >
                    {part.text}
                </span>
            ));

            return (
                <TreeItem
                    key={item[fieldNames["value"]] + ""}
                    itemId={item[fieldNames["value"]] + ""}
                    label={labels}
                    disabled={item.disabled}
                >
                    {existChildren &&
                        renderTreeItem(item[fieldNames["children"]])}
                </TreeItem>
            );
        });
    };

    if (!treeData || (treeData && treeData.length == 0)) {
        return "No available options";
    }

    return (
        <Box>
            <SimpleTreeView
                expansionTrigger="iconContainer"
                expandedItems={expandedItems}
                selectedItems={value}
                onExpandedItemsChange={handleExpandedItemsChange}
                onSelectedItemsChange={handleSelectedItemsChange}
            >
                {treeData && renderTreeItem(treeData)}
            </SimpleTreeView>
        </Box>
    );
};
