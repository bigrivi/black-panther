import { FC, PropsWithChildren, useMemo, useState } from "react";
import { IResource, IRole } from "@/interfaces";
import { zip } from "@/utils/zip";
import { usePolicyProviderContext } from "../../context";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
    Card as MCard,
    CardContent,
    CardHeader as MCardHeader,
    IconButton,
    Table,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    styled,
    CardProps,
    lighten,
    darken,
    alpha,
    CardHeaderProps,
    TableBody,
    Menu,
    MenuItem,
    ListItemText,
    Divider,
    ListItemIcon,
} from "@mui/material";
import { cardClasses } from "@mui/material/Card";
import { cardHeaderClasses } from "@mui/material/CardHeader";
import { BorderedCell } from "../common/BorderedCell";
import { ActionCell } from "./ActionCell";
import { CheckBoxOutlineBlank, LibraryAddCheck } from "@mui/icons-material";

type RoleEditorProps = {
    role: IRole;
    resources: IResource[];
};

const Card = styled(({ children, ...rest }: CardProps) => {
    return <MCard {...rest}>{children}</MCard>;
})(({ theme }) => ({
    [`&.${cardClasses.root}`]: {
        overflow: "hidden",
        borderRadius: 8,
        boxShadow: "none",
        border: `1px solid ${
            theme.palette.mode === "light"
                ? lighten(alpha(theme.palette.divider, 1), 0.88)
                : darken(alpha(theme.palette.divider, 1), 0.68)
        }`,
    },
    ["& .MuiTableRow-root:last-child td"]: {
        borderBottom: "0px solid",
    },
}));

const CardHeader = styled(({ children, ...rest }: CardHeaderProps) => {
    return <MCardHeader {...rest}>{children}</MCardHeader>;
})(({ theme }) => ({
    [`&.${cardHeaderClasses.root}`]: {
        borderBottom: `1px solid ${
            theme.palette.mode === "light"
                ? lighten(alpha(theme.palette.divider, 1), 0.88)
                : darken(alpha(theme.palette.divider, 1), 0.68)
        }`,
    },
}));

export const RoleEditor: FC<PropsWithChildren<RoleEditorProps>> = ({
    resources,
    role,
}) => {
    const { handleActionSelectionChange } = usePolicyProviderContext();
    const [openResource, setOpenResource] = useState<IResource>();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const handleClose = () => {
        setAnchorEl(null);
        setOpenResource(undefined);
    };
    const dataSource = useMemo(() => {
        if (!resources || resources.length == 0) {
            return [];
        }
        const zipped = zip(...resources.map((item) => item.actions));
        return zipped.reduce((acc, item, row) => {
            return [
                ...acc,
                {
                    id: row,
                    ...item.reduce((a, e, col) => {
                        return {
                            ...a,
                            ["col_" + col]: e,
                        };
                    }, {}),
                },
            ];
        }, []);
    }, [resources]);

    const handleMenuItemClick = (key: string) => {
        const allActionIds: number[] = openResource
            ? openResource.actions!!.map((item) => item.id)
            : resources.flatMap((item) => item.actions!.map((item) => item.id));

        if (key == "allowAll") {
            handleActionSelectionChange(true, role.id, allActionIds);
        } else if (key == "clear") {
            handleActionSelectionChange(false, role.id, allActionIds);
        }
        handleClose();
    };

    const handleCellClick = (
        event: React.MouseEvent<HTMLTableCellElement | HTMLButtonElement>,
        resource?: IResource
    ) => {
        setAnchorEl(event.currentTarget);
        setOpenResource(resource);
    };
    const open = Boolean(anchorEl);

    return (
        <>
            <Card elevation={0}>
                <CardHeader
                    title={role.name}
                    action={
                        <IconButton
                            onClick={(e) => handleCellClick(e, undefined)}
                            aria-label="settings"
                        >
                            <MoreVertIcon />
                        </IconButton>
                    }
                />
                <CardContent>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {resources.map((resource) => {
                                        return (
                                            <BorderedCell
                                                onClick={(e) =>
                                                    handleCellClick(e, resource)
                                                }
                                                className="hover"
                                                style={{
                                                    minWidth: 176,
                                                    width: 176,
                                                }}
                                                key={resource.id}
                                            >
                                                {resource.name}
                                            </BorderedCell>
                                        );
                                    })}
                                    <TableCell />
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {dataSource.map((row) => {
                                    return (
                                        <TableRow key={row.id}>
                                            {resources.map(
                                                (resource, columnIndex) => (
                                                    <ActionCell
                                                        key={resource.id}
                                                        roleId={role.id}
                                                        data={
                                                            row[
                                                                "col_" +
                                                                    columnIndex
                                                            ]
                                                        }
                                                    />
                                                )
                                            )}
                                            <TableCell />
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>
            <Menu
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: openResource ? "left" : "center",
                }}
                transformOrigin={{
                    horizontal: openResource ? "left" : "right",
                    vertical: "top",
                }}
                open={open}
                onClose={handleClose}
            >
                <MenuItem disableRipple disabled>
                    <ListItemText>
                        {openResource?.name ?? role.name}
                    </ListItemText>
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
