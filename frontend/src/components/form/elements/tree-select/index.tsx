import SearchInput from "@/components/ui/search-input";
import { TreeView } from "@/components/ui/tree-view";
import { ITreeNode } from "@/interfaces";
import { filterTree, getExpandFilteredNodeIds } from "@/utils/tree";
import { ArrowDropDown, ArrowDropUp, Close } from "@mui/icons-material";
import {
    Box,
    ClickAwayListener,
    Divider,
    FormHelperText,
    IconButton,
    OutlinedInput,
    Paper,
    Popper,
    useEventCallback,
} from "@mui/material";
import { useTranslate } from "@refinedev/core";
import {
    ChangeEvent,
    forwardRef,
    ReactNode,
    Ref,
    RefAttributes,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import {
    Control,
    FieldError,
    FieldPath,
    FieldValues,
    PathValue,
    useController,
    UseControllerProps,
} from "react-hook-form";
import { useFormError, useTransform } from "react-hook-form-mui";

type FieldNames = {
    label: string;
    value: string;
    children: string;
};

export const findNodeById = (
    treeData: ITreeNode[],
    nodeId: any,
    fieldNames: FieldNames
): ITreeNode | null => {
    for (const item of treeData) {
        if (item[fieldNames["value"]] == nodeId) {
            return item;
        }
        const children = item[fieldNames["children"]];
        if (children && children.length) {
            const found = findNodeById(children, nodeId, fieldNames);
            if (found) {
                return found;
            }
        }
    }
    return null;
};

export type TreeSelectFieldElementProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
    TValue = unknown
> = {
    treeData: ITreeNode[];
    fieldNames?: FieldNames;
    id?: string;
    required?: boolean;
    disabled?: boolean;
    placeholder?: string;
    helperText?: ReactNode;
    rules?: UseControllerProps<TFieldValues, TName>["rules"];
    name: TName;
    parseError?: (error: FieldError) => ReactNode;
    control?: Control<TFieldValues>;
    transform?: {
        input?: (value: PathValue<TFieldValues, TName>) => TValue;
        output?: (
            event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => PathValue<TFieldValues, TName>;
    };
};

type TreeSelectFieldElementComponent = <
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
    TValue = unknown
>(
    props: TreeSelectFieldElementProps<TFieldValues, TName, TValue> &
        RefAttributes<HTMLDivElement>
) => JSX.Element;

const TreeSelectFieldElement = forwardRef(function TreeSelectFieldElement<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
    TValue = unknown
>(
    props: TreeSelectFieldElementProps<TFieldValues, TName, TValue>,
    ref: Ref<HTMLDivElement>
) {
    const {
        rules = {},
        fieldNames = {
            label: "title",
            value: "value",
            children: "children",
        },
        parseError,
        name,
        id,
        control,
        transform,
        helperText,
        required,
        disabled,
        treeData,
        placeholder,
    } = props;

    const errorMsgFn = useFormError();
    const customErrorFn = parseError || errorMsgFn;
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [expandedItems, setExpandedItems] = useState<string[]>([]);
    const [filterText, setFilterText] = useState("");
    const t = useTranslate();

    const rulesTmp = {
        ...rules,
        ...(required &&
            !rules.required && { required: "This field is required" }),
    };

    const {
        field,
        fieldState: { error },
    } = useController({
        name,
        control,
        disabled,
        rules: rulesTmp,
    });

    const { value, onChange } = useTransform<TFieldValues, TName, TValue>({
        value: field.value,
        onChange: field.onChange,
        transform: {
            input:
                typeof transform?.input === "function"
                    ? transform.input
                    : (value) => {
                          return value ? String(value) : null;
                      },
            output:
                typeof transform?.output === "function"
                    ? transform.output
                    : (value) => {
                          if (value === "") {
                              return null as PathValue<TFieldValues, TName>;
                          }

                          if (value == null) {
                              return value;
                          }

                          return Number(value) as PathValue<
                              TFieldValues,
                              TName
                          >;
                      },
        },
    });

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
            console.log(filteredTree);
            return filteredTree;
        } else {
            return treeData;
        }
    }, [treeData, filterText]);

    const handleFilter = useCallback(
        (value: string) => {
            console.log(value);
            setFilterText(value);
            if (value) {
                const expandedNodeIds: string[] = getExpandFilteredNodeIds(
                    treeData,
                    value,
                    fieldNames
                );
                console.log("expandedNodeIds", expandedNodeIds);
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

    const renderHelperText = error
        ? typeof customErrorFn === "function"
            ? customErrorFn(error)
            : error.message
        : helperText;

    const open = Boolean(anchorEl);

    useEffect(() => {
        if (treeData?.length && value) {
            const expandedNodeIds: string[] = getExpandFilteredNodeIds(
                treeData,
                "",
                fieldNames,
                (_, node, fieldNames) => {
                    return node[fieldNames.value] == value;
                }
            );
            console.log("expandedNodeIds", expandedNodeIds);
            setExpandedItems(expandedNodeIds.map(String));
        }
    }, [treeData, value]);

    return (
        <>
            <OutlinedInput
                id={id}
                name={field.name}
                placeholder={placeholder}
                disabled={disabled}
                readOnly
                value={selectedItem ? selectedItem[fieldNames.label] : ""}
                inputProps={{ style: { cursor: "pointer" } }}
                onClick={handleInputClick}
                onBlur={() => {
                    field.onBlur();
                }}
                required={required}
                error={!!error}
                endAdornment={
                    open ? (
                        <ArrowDropUp fontSize="small" />
                    ) : (
                        <ArrowDropDown fontSize="small" />
                    )
                }
                ref={ref}
            />

            {renderHelperText && (
                <FormHelperText error={!!error}>
                    {renderHelperText}
                </FormHelperText>
            )}

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
                                onChange={(value) => {
                                    onChange(value);
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
});
TreeSelectFieldElement.displayName = "TreeSelectFieldElement";
export default TreeSelectFieldElement as TreeSelectFieldElementComponent;
