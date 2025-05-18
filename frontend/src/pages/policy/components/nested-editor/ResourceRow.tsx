import { IResource } from "@/interfaces";
import {
    CheckBoxOutlineBlank,
    ChevronRightOutlined,
    ExpandMoreOutlined,
    LibraryAddCheck,
} from "@mui/icons-material";
import {
    Divider,
    IconButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    TableRow as MUITableRow,
    styled,
    TableRowProps,
} from "@mui/material";
import classNames from "classnames";
import { FC, useState } from "react";
import { usePolicyProviderContext } from "../../context";
import { BorderedCell } from "../common/BorderedCell";
import { useHighLightRowColumnContext } from "./context";
import { ResourceCell } from "./ResourceCell";
import { StickColumn } from "./StickColumn";
type ResourceRowProps = {
    resource: IResource;
    isExpanded: boolean;
    toggleRowExpanded: (resourceId: number) => void;
};

const TableRow = styled(({ children, ...rest }: TableRowProps) => {
    return <MUITableRow {...rest}>{children}</MUITableRow>;
})(({ theme }) => ({
    ["& .MuiTableCell-root:first-of-type"]: {
        background: theme.palette.mode === "light" ? "#fff" : "#1e1e1e",
    },
}));

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
