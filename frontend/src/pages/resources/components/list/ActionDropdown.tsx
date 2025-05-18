import { FC } from "react";
import { IAction, IResource } from "@/interfaces";
import { Delete, Edit, MoreHorizOutlined } from "@mui/icons-material";
import {
    Divider,
    IconButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
} from "@mui/material";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";

type ActionDropdownProps = {
    action: IAction;
    resourceId: number;
    onEdit: () => void;
    onDelete: () => void;
};
export const ActionDropdown: FC<ActionDropdownProps> = ({
    action,
    onEdit,
    resourceId,
    onDelete,
}) => {
    return (
        <PopupState variant="popover" popupId="2">
            {(popupState) => (
                <div>
                    <IconButton size="small" {...bindTrigger(popupState)}>
                        <MoreHorizOutlined />
                    </IconButton>
                    <Menu
                        {...bindMenu(popupState)}
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                        }}
                        transformOrigin={{
                            vertical: "top",
                            horizontal: "right",
                        }}
                    >
                        <MenuItem disableRipple disabled>
                            <ListItemText>{action.name}</ListItemText>
                        </MenuItem>
                        <Divider />
                        <MenuItem
                            onClick={() => {
                                popupState.close();
                                onEdit();
                            }}
                        >
                            <ListItemIcon>
                                <Edit />
                            </ListItemIcon>
                            <ListItemText>Edit Action</ListItemText>
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                popupState.close();
                                onDelete();
                            }}
                        >
                            <ListItemIcon>
                                <Delete color="error" />
                            </ListItemIcon>
                            <ListItemText color="error">
                                Delete Action
                            </ListItemText>
                        </MenuItem>
                    </Menu>
                </div>
            )}
        </PopupState>
    );
};
