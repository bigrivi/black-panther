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
    FormHelperText,
    IconButton,
    InputAdornment,
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

export type TreeSelectFieldElementProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
    TValue = unknown
> = {
    treeData?: ITreeNode[];
    fieldNames?: FieldNames;
    id?: string;
    required?: boolean;
    disabled?: boolean;
    placeholder?: string;
    helperText?: ReactNode;
    rules?: UseControllerProps<TFieldValues, TName>["rules"];
    name?: TName;
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
            label: "name",
            value: "id",
            children: "children",
        },
        treeData = [],
        parseError,
        name,
        id,
        control,
        transform,
        helperText,
        required,
        disabled,
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
        name: name!,
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

    const handleClear = (e) => {
        e.stopPropagation();
        onChange(null);
    };

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
                endAdornment={endAdornment}
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
