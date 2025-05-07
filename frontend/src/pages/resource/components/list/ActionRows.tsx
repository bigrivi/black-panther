import { IAction, IResource } from "@/interfaces";
import { MoreHorizOutlined, Remove } from "@mui/icons-material";
import {
    styled,
    TableCell,
    TableRow as MUITableRow,
    TableRowProps,
    tableRowClasses,
    IconButton,
} from "@mui/material";
import { FC } from "react";

type ActionRowsProp = {
    resource: IResource;
    actions: IAction[];
};

const TableRow = styled(({ children, ...rest }: TableRowProps) => {
    return <MUITableRow {...rest}>{children}</MUITableRow>;
})(({ theme }) => ({
    [`&.${tableRowClasses.root}`]: {
        background: theme.palette.mode === "light" ? "#fafafa" : "#010101",
    },
    ["& .MuiTableCell-root:first-child"]: {
        background: theme.palette.mode === "light" ? "#fafafa" : "#010101",
    },
}));

export const ActionRows: FC<ActionRowsProp> = ({ actions, resource }) => {
    return actions?.map((action) => {
        return (
            <TableRow key={resource.id + "_" + action.id}>
                <TableCell
                    align={"left"}
                    style={{
                        minWidth: 176,
                    }}
                >
                    <div
                        style={{
                            paddingLeft: 40,
                        }}
                    >
                        {action.name}
                    </div>
                </TableCell>
                <TableCell align={"left"}></TableCell>
                <TableCell style={{ width: 150 }} align={"center"}>
                    <IconButton>
                        <Remove />
                    </IconButton>
                    <IconButton>
                        <MoreHorizOutlined />
                    </IconButton>
                </TableCell>
            </TableRow>
        );
    });
};
