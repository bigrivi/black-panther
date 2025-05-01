import { FC } from "react";
import { IconButton, TableRow } from "@mui/material";
import { StickColumn } from "./StickColumn";
import { IResource, IRole } from "@/interfaces";
import { ResourceCell } from "./ResourceCell";
import { BorderedCell } from "./BorderedCell";
import { ChevronRightOutlined, ExpandMoreOutlined } from "@mui/icons-material";
import { usePolicyProviderContext } from "../../context";
import classNames from "classnames";
import { useHighLightRowColumnContext } from "./context";
type ResourceRowProps = {
    resource: IResource;
    isExpanded: boolean;
    toggleRowExpanded: (resourceId: number) => void;
};
export const ResourceRow: FC<ResourceRowProps> = ({
    resource,
    isExpanded,
    toggleRowExpanded,
}) => {
    const { filteredRoles } = usePolicyProviderContext();
    const { row: highlightRow } = useHighLightRowColumnContext();

    return (
        <TableRow>
            <StickColumn
                align={"left"}
                className={classNames({
                    highlight: highlightRow == resource.index,
                })}
                style={{
                    minWidth: 176,
                    padding: 0,
                }}
            >
                <IconButton
                    size="small"
                    onClick={() => toggleRowExpanded(resource.id)}
                >
                    {isExpanded && <ExpandMoreOutlined />}
                    {!isExpanded && <ChevronRightOutlined />}
                </IconButton>
                <span style={{ fontWeight: 500 }}>{resource.name}</span>
            </StickColumn>
            {filteredRoles.map((role, col) => (
                <ResourceCell
                    key={role.id}
                    column={col}
                    resource={resource}
                    role={role}
                />
            ))}
            <BorderedCell
                className={classNames({
                    highlight: highlightRow == resource.index,
                })}
            />
        </TableRow>
    );
};
