import { useList, useTranslate } from "@refinedev/core";
import { MRT_Header, MRT_RowData } from "material-react-table";
import { FC, useCallback, useMemo, useState } from "react";

import SearchInput from "@/components/ui/search-input";
import { TreeView } from "@/components/ui/tree-view";
import { ITreeNode } from "@/interfaces";
import {
    filterTree,
    findNodeById,
    getExpandFilteredNodeIds,
} from "@/utils/tree";
import {
    ArrowDropDown,
    ArrowDropUp,
    Close,
    CloseOutlined,
} from "@mui/icons-material";
import {
    Box,
    ClickAwayListener,
    Divider,
    IconButton,
    InputAdornment,
    OutlinedInput,
    Paper,
    Popper,
    useEventCallback,
} from "@mui/material";

type FieldNames = {
    label: string;
    value: string;
    children: string;
};

export type ReferenceNodeFilterProps<TData extends MRT_RowData> = {
    header: MRT_Header<TData>;
    resource: string;
    searchField?: string;
    optionLabel?: string;
    optionValue?: string;
    fieldNames?: FieldNames;
};

export const ReferenceNodeFilter: FC<ReferenceNodeFilterProps<any>> = ({
    header,
    resource,
    fieldNames = {
        label: "name",
        value: "id",
        children: "children",
    },
}) => {
    const value = header.column.getFilterValue() ?? null;
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [expandedItems, setExpandedItems] = useState<string[]>([]);
    const [filterText, setFilterText] = useState("");
    const t = useTranslate();
    const { data } = useList({
        resource,
        meta: {
            isTree: true,
        },
    });

    const treeData = data?.data ?? [];

    const handleInputClick = useEventCallback(
        (event: React.MouseEvent<HTMLElement>) => {
            setAnchorEl(anchorEl ? null : event.currentTarget);
        }
    );

    const close = () => {
        setAnchorEl(null);
    };

    const handleClickAway = (event: any) => {
        close();
    };

    const filteredTree = useMemo(() => {
        if (filterText) {
            const filteredTree = filterTree(treeData, filterText, fieldNames);
            return filteredTree;
        } else {
            return treeData;
        }
    }, [treeData, filterText]);

    const handleFilter = useCallback(
        (value: string) => {
            setFilterText(value);
            if (value) {
                const expandedNodeIds: string[] = getExpandFilteredNodeIds(
                    treeData,
                    value,
                    fieldNames
                );
                setExpandedItems(expandedNodeIds.map(String));
            } else {
                setExpandedItems([]);
            }
        },
        [treeData]
    );

    const selectedItem: ITreeNode | null = useMemo(() => {
        if (value) {
            return findNodeById(treeData, value, fieldNames);
        }
        return null;
    }, [treeData, value]);

    const handleClear = (e) => {
        e.stopPropagation();
        header.column.setFilterValue(null);
    };
    const open = Boolean(anchorEl);
    const endAdornment = (
        <InputAdornment position="end" sx={{}}>
            <IconButton
                onClick={handleClear}
                size="small"
                sx={{
                    height: "2rem",
                    transform: "scale(0.9)",
                    width: "2rem",
                    visibility: value ? "visible" : "hidden",
                }}
            >
                <CloseOutlined />
            </IconButton>
            {open ? (
                <ArrowDropUp fontSize="small" />
            ) : (
                <ArrowDropDown fontSize="small" />
            )}
        </InputAdornment>
    );

    return (
        <>
            <OutlinedInput
                sx={{ width: 300 }}
                readOnly
                value={selectedItem ? selectedItem[fieldNames.label] : ""}
                inputProps={{ style: { cursor: "pointer" } }}
                onClick={handleInputClick}
                endAdornment={endAdornment}
            />

            <Popper
                placement="bottom-start"
                open={open}
                style={{ zIndex: 9999 }}
                anchorEl={anchorEl}
            >
                <ClickAwayListener onClickAway={handleClickAway}>
                    <Paper
                        variant="outlined"
                        sx={{
                            width: anchorEl?.clientWidth,
                            overflow: "hidden",
                            borderRadius: "8px",
                        }}
                    >
                        <Box
                            display="flex"
                            borderRadius="0"
                            height="60px"
                            sx={{ padding: "10px" }}
                            alignItems="center"
                            bgcolor="#f9fafb"
                        >
                            <SearchInput
                                autoFocus
                                value={filterText}
                                placeholder={t("search.placeholder")}
                                onChange={handleFilter}
                            />
                            <IconButton
                                onClick={close}
                                sx={{
                                    marginLeft: "auto",
                                }}
                            >
                                <Close />
                            </IconButton>
                        </Box>
                        <Divider />
                        <Box
                            sx={{
                                maxHeight: "45vh",
                                padding: "12px",
                                overflow: "auto",
                            }}
                        >
                            <TreeView
                                filterText={filterText}
                                expandedItems={expandedItems}
                                onExpandedItemsChange={setExpandedItems}
                                fieldNames={fieldNames}
                                value={value as string}
                                onChange={(newValue) => {
                                    header.column.setFilterValue(
                                        newValue ?? null
                                    );
                                    close();
                                }}
                                treeData={filteredTree}
                            />
                        </Box>
                    </Paper>
                </ClickAwayListener>
            </Popper>
        </>
    );
};
