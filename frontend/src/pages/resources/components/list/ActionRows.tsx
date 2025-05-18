import { IAction, IResource } from "@/interfaces";
import { Remove } from "@mui/icons-material";
import {
    IconButton,
    TableRow as MUITableRow,
    Stack,
    styled,
    TableCell,
    tableRowClasses,
    TableRowProps,
} from "@mui/material";
import { FC } from "react";
import { ActionDropdown } from "./ActionDropdown";
type ActionRowsProp = {
    resource: IResource;
    actions: IAction[];
    onEdit: (action: IAction) => void;
    onDelete: (action: IAction) => void;
};

const TableRow = styled(({ children, ...rest }: TableRowProps) => {
    return <MUITableRow {...rest}>{children}</MUITableRow>;
})(({ theme }) => ({
    [`&.${tableRowClasses.root}`]: {
        background: theme.palette.mode === "light" ? "#fafafa" : "#010101",
    },
    ["& .MuiTableCell-root:first-of-type"]: {
        background: theme.palette.mode === "light" ? "#fafafa" : "#010101",
    },
}));

export const ActionRows: FC<ActionRowsProp> = ({
    actions,
    resource,
    onEdit,
    onDelete,
}) => {
    return actions?.map((action) => (
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
                <Stack direction={"row"}>
                    <IconButton onClick={() => onDelete(action)} size="small">
                        <Remove />
                    </IconButton>
                    <ActionDropdown
                        resourceId={resource.id}
                        onEdit={() => onEdit(action)}
                        onDelete={() => onDelete(action)}
                        action={action}
                    />
                </Stack>
            </TableCell>
        </TableRow>
    ));
};
