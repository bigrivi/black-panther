import { IAction } from "@/interfaces";
import { Delete, Edit, MoreHorizOutlined } from "@mui/icons-material";
import {
    Divider,
    IconButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
} from "@mui/material";
import { useCan, useTranslate } from "@refinedev/core";
import PopupState, { bindMenu, bindTrigger } from "material-ui-popup-state";
import { FC } from "react";

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
    const t = useTranslate();
    const { data: canEdit } = useCan({
        resource: "resource",
        action: "edit-action",
    });
    const { data: canDelete } = useCan({
        resource: "resource",
        action: "delete-action",
    });
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
                        {canEdit?.can && (
                            <MenuItem
                                onClick={() => {
                                    popupState.close();
                                    onEdit();
                                }}
                            >
                                <ListItemIcon>
                                    <Edit />
                                </ListItemIcon>
                                <ListItemText>
                                    {t("resourceActions.actions.edit")}
                                </ListItemText>
                            </MenuItem>
                        )}
                        {canDelete?.can && (
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
                                    {t("resourceActions.actions.delete.label")}
                                </ListItemText>
                            </MenuItem>
                        )}
                    </Menu>
                </div>
            )}
        </PopupState>
    );
};
