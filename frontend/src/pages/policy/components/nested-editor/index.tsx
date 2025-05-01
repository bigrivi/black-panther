import {
    FC,
    Fragment,
    PropsWithChildren,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { IAction, IResource, IRole } from "@/interfaces";
import { usePolicyProviderContext } from "../../context";
import {
    Checkbox,
    IconButton,
    styled,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import { BorderedCell } from "./BorderedCell";
import { StickColumn } from "./StickColumn";
import { ActionRows } from "./ActionRows";
import { ResourceRow } from "./ResourceRow";
import { Paper } from "@/components";
import { HighLightRowColumnContext } from "./context";
import classNames from "classnames";
const headerItems: any = [
    {
        label: "Clear Permissions",
        key: "clear",
    },
    {
        label: "Allow All",
        key: "allowAll",
    },
];

type NestedEditorProps = {};

export const NestedEditor: FC<PropsWithChildren<NestedEditorProps>> = ({}) => {
    const [expandedRowKeys, setExpandedRowKeys] = useState<number[]>([]);
    const [highlightColumn, setHighlightColumn] = useState<number>();
    const [highlightRow, setHighlightRow] = useState<number>();

    const {
        filteredResources,
        filteredRoles,
        resources,
        selectedRoleActions,
        handleActionSelectionChange,
        changedCount,
    } = usePolicyProviderContext();

    const handleHeaderClick = (key: string, roleId: number) => {
        const allActions: IAction[] | undefined = filteredResources?.flatMap(
            (item) => item.actions as IAction[]
        );
        const allActionIds = allActions.map((item) => item.id);
        if (allActions && key == "allowAll") {
            handleActionSelectionChange(true, roleId, allActionIds);
        } else if (key == "clear") {
            handleActionSelectionChange(false, roleId, allActionIds);
        }
    };

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

    const scrollHeight = useMemo(() => {
        if (changedCount > 0) {
            return "calc(-300px + 100vh)";
        }
        return "calc(-300px + 100vh)";
    }, [changedCount]);

    useEffect(() => {
        if (resources && resources.length > 0) {
            setExpandedRowKeys(resources.map((item: IResource) => item.id));
        }
    }, [resources]);

    return (
        <Paper elevation={0} sx={{ width: "100%", overflow: "hidden" }}>
            <HighLightRowColumnContext.Provider
                value={{
                    row: highlightRow,
                    column: highlightColumn,
                    setColumn: setHighlightColumn,
                    setRow: setHighlightRow,
                }}
            >
                <TableContainer sx={{ maxHeight: scrollHeight }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <StickColumn
                                    align={"left"}
                                    style={{
                                        minWidth: 176,
                                        width: 176,
                                        zIndex: 100,
                                    }}
                                >
                                    Resource
                                </StickColumn>
                                {filteredRoles.map((role, col) => {
                                    return (
                                        <BorderedCell
                                            key={role.id}
                                            className={classNames({
                                                highlight:
                                                    highlightColumn == col,
                                            })}
                                            align={"center"}
                                            style={{
                                                minWidth: 176,
                                                width: 176,
                                                zIndex: 99,
                                            }}
                                        >
                                            {role.name}
                                        </BorderedCell>
                                    );
                                })}
                                <BorderedCell></BorderedCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredResources.map((resource, row) => {
                                const isExpanded = expandedRowKeys.includes(
                                    resource.id
                                );
                                return (
                                    <Fragment key={resource.id}>
                                        <ResourceRow
                                            isExpanded={isExpanded}
                                            toggleRowExpanded={
                                                toggleRowExpanded
                                            }
                                            resource={resource}
                                        />
                                        {isExpanded && (
                                            <ActionRows resource={resource} />
                                        )}
                                    </Fragment>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </HighLightRowColumnContext.Provider>
        </Paper>
    );
};
