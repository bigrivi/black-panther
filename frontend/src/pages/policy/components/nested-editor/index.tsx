import {
    FC,
    Fragment,
    PropsWithChildren,
    useEffect,
    useMemo,
    useState,
} from "react";
import { IResource } from "@/interfaces";
import { usePolicyProviderContext } from "../../context";
import {
    paperClasses,
    PaperProps,
    styled,
    Table,
    TableBody,
    TableContainer,
    TableHead,
} from "@mui/material";
import { ActionRows } from "./ActionRows";
import { ResourceRow } from "./ResourceRow";
import { Paper as MUIPaper } from "@/components";
import { HighLightRowColumnContext } from "./context";
import { Header } from "./Header";

type NestedEditorProps = {};

const Paper = styled(({ children, ...rest }: PaperProps) => {
    return <MUIPaper {...rest}>{children}</MUIPaper>;
})(({ theme }) => ({
    [`&.${paperClasses.root}`]: {
        overflow: "hidden",
        borderRadius: 8,
        boxShadow: "none",
        width: "100%",
    },
    ["& .MuiTableRow-root:last-child td"]: {
        borderBottom: "0px solid",
    },
}));

export const NestedEditor: FC<PropsWithChildren<NestedEditorProps>> = ({}) => {
    const [expandedRowKeys, setExpandedRowKeys] = useState<number[]>([]);
    const [highlightColumn, setHighlightColumn] = useState<number>();
    const [highlightRow, setHighlightRow] = useState<number>();

    const { filteredResources, resources, changedCount } =
        usePolicyProviderContext();

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
            return "calc(-260px + 100vh)";
        }
        return "calc(-215px + 100vh)";
    }, [changedCount]);

    useEffect(() => {
        if (resources && resources.length > 0) {
            setExpandedRowKeys(resources.map((item: IResource) => item.id));
        }
    }, [resources]);

    return (
        <Paper>
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
                            <Header />
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
