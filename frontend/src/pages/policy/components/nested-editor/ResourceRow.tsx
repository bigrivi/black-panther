import { FC, useState } from "react";
import {
    Divider,
    ListItemIcon,
    ListItemText,
    IconButton,
    Menu,
    MenuItem,
    TableRow,
} from "@mui/material";
import { StickColumn } from "./StickColumn";
import { IAction, IResource, IRole } from "@/interfaces";
import { ResourceCell } from "./ResourceCell";
import { BorderedCell } from "./BorderedCell";
import {
    CheckBoxOutlineBlank,
    ChevronRightOutlined,
    ExpandMoreOutlined,
    LibraryAddCheck,
} from "@mui/icons-material";
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
    const { filteredRoles, handleActionSelectionChange } =
        usePolicyProviderContext();
    const { row: highlightRow } = useHighLightRowColumnContext();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleCellClick = (event: React.MouseEvent<HTMLTableCellElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuItemClick = (key: string) => {
        if (!resource.actions) {
            return;
        }
        for (const role of filteredRoles) {
            const allActionIds: number[] | undefined = resource.actions?.map(
                (item) => item.id
            );
            if (key == "allowAll") {
                handleActionSelectionChange(true, role.id, allActionIds);
            } else if (key == "clear") {
                handleActionSelectionChange(false, role.id, allActionIds);
            }
        }
        handleClose();
    };

    const open = Boolean(anchorEl);

    return (
        <>
            <TableRow>
                <StickColumn
                    align={"left"}
                    className={classNames("hover", {
                        highlight: highlightRow == resource.index,
                    })}
                    onClick={(evt) => handleCellClick(evt)}
                    style={{
                        minWidth: 176,
                        width: 176,
                        padding: 0,
                        background: "#fff",
                    }}
                >
                    <IconButton
                        size="small"
                        onClick={(evt) => {
                            evt.stopPropagation();
                            toggleRowExpanded(resource.id);
                        }}
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
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                <MenuItem disableRipple disabled>
                    <ListItemText>{resource?.name}</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => handleMenuItemClick("clear")}>
                    <ListItemIcon>
                        <CheckBoxOutlineBlank />
                    </ListItemIcon>
                    <ListItemText>Clear Permissions</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => handleMenuItemClick("allowAll")}>
                    <ListItemIcon>
                        <LibraryAddCheck />
                    </ListItemIcon>
                    <ListItemText>Allow All</ListItemText>
                </MenuItem>
            </Menu>
        </>
    );
};
