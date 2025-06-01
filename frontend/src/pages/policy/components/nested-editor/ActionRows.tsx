import { BorderedCell } from "@/components";
import { IResource } from "@/interfaces";
import {
    TableRow as MUITableRow,
    TableRowProps,
    styled,
    tableRowClasses,
} from "@mui/material";
import classNames from "classnames";
import { FC } from "react";
import { usePolicyProviderContext } from "../../context";
import { ActionCell } from "./ActionCell";
import { useHighLightRowColumnContext } from "./context";
import { StickColumn } from "./StickColumn";

type ActionRowsProps = {
    resource: IResource;
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

export const ActionRows: FC<ActionRowsProps> = ({ resource }) => {
    const { filteredRoles } = usePolicyProviderContext();
    const { row: highlightRow } = useHighLightRowColumnContext();
    return resource.actions!.map((action, col) => {
        return (
            <TableRow key={resource.id + "_" + action.id}>
                <StickColumn
                    align={"left"}
                    className={classNames({
                        highlight: highlightRow == action.index,
                    })}
                    style={{
                        minWidth: 176,
                    }}
                >
                    <div
                        style={{
                            paddingLeft: 25,
                        }}
                    >
                        {action.name}
                    </div>
                </StickColumn>
                {filteredRoles.map((role, col) => (
                    <ActionCell
                        key={role.id}
                        column={col}
                        role={role}
                        action={action}
                    />
                ))}
                <BorderedCell
                    className={classNames({
                        highlight: highlightRow == action.index,
                    })}
                ></BorderedCell>
            </TableRow>
        );
    });
};
