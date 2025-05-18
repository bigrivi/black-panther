import { ConfirmDialog } from "@/components";
import { IResource } from "@/interfaces";
import { Delete, Edit, MoreHorizOutlined } from "@mui/icons-material";
import {
    Divider,
    IconButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
} from "@mui/material";
import { useDelete, useGo, useNavigation } from "@refinedev/core";
import PopupState, { bindMenu, bindTrigger } from "material-ui-popup-state";
import { FC, useState } from "react";
import { useLocation } from "react-router";

type ResourceDropdownProps = {
    resource: IResource;
};
export const ResourceDropdown: FC<ResourceDropdownProps> = ({ resource }) => {
    const { editUrl } = useNavigation();
    const { pathname } = useLocation();
    const { mutateAsync } = useDelete();
    const [dialogVisible, setDialogVisible] = useState(false);

    const go = useGo();
    const handleDelete = async () => {
        await mutateAsync({
            id: resource.id,
            resource: "resource",
        });
    };
    return (
        <>
            <PopupState variant="popover" popupId="1">
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
                                <ListItemText>{resource.name}</ListItemText>
                            </MenuItem>
                            <Divider />
                            <MenuItem
                                onClick={() => {
                                    go({
                                        to: `${editUrl(
                                            "resource",
                                            resource.id
                                        )}`,
                                        query: {
                                            to: pathname,
                                        },
                                        options: {
                                            keepQuery: true,
                                        },
                                        type: "replace",
                                    });
                                    popupState.close();
                                }}
                            >
                                <ListItemIcon>
                                    <Edit />
                                </ListItemIcon>
                                <ListItemText>Edit Resource</ListItemText>
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    popupState.close();
                                    setDialogVisible(true);
                                }}
                            >
                                <ListItemIcon>
                                    <Delete color="error" />
                                </ListItemIcon>
                                <ListItemText color="error">
                                    Delete Resource
                                </ListItemText>
                            </MenuItem>
                        </Menu>
                    </div>
                )}
            </PopupState>
            <ConfirmDialog
                title="Delete Resource"
                message={
                    "Are you sure you want to delete the resource: " +
                    resource.name +
                    "?"
                }
                onConfirm={handleDelete}
                open={dialogVisible}
                onClose={() => setDialogVisible(false)}
            ></ConfirmDialog>
        </>
    );
};
