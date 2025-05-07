import { ConfirmButton } from "@/components";
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
import {
    useDelete,
    useEditButton,
    useGo,
    useNavigation,
} from "@refinedev/core";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import { FC } from "react";
import { useLocation } from "react-router";
type ResourceDropdownProps = {
    resource: IResource;
};
export const ResourceDropdown: FC<ResourceDropdownProps> = ({ resource }) => {
    const { editUrl } = useNavigation();
    const { pathname } = useLocation();
    const { mutateAsync } = useDelete();
    const go = useGo();
    const handleDelete = async () => {
        await mutateAsync({
            id: resource.id,
            resource: "resource",
        });
    };
    return (
        <PopupState variant="popover">
            {(popupState) => (
                <div>
                    <IconButton {...bindTrigger(popupState)}>
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
                                    to: `${editUrl("resource", resource.id)}`,
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
                        <ConfirmButton
                            message="Do you want to delete this record?"
                            onConfirm={handleDelete}
                            onShow={popupState.close}
                        >
                            <MenuItem>
                                <ListItemIcon>
                                    <Delete color="error" />
                                </ListItemIcon>
                                <ListItemText color="error">
                                    Delete Resource
                                </ListItemText>
                            </MenuItem>
                        </ConfirmButton>
                    </Menu>
                </div>
            )}
        </PopupState>
    );
};
