import { IResource, IRole } from "@/interfaces";
import { TableRow } from "@mui/material";
import { FC } from "react";
import { ActionCell } from "./ActionCell";
import { BorderedCell } from "./BorderedCell";
import { StickColumn } from "./StickColumn";
import { usePolicyProviderContext } from "../../context";
import { useHighLightRowColumnContext } from "./context";
import classNames from "classnames";

type ActionRowsProps = {
    resource: IResource;
};
export const ActionRows: FC<ActionRowsProps> = ({ resource }) => {
    const { filteredRoles } = usePolicyProviderContext();
    const { row: highlightRow } = useHighLightRowColumnContext();
    return resource.actions!.map((action, col) => {
        return (
            <TableRow
                style={{ background: "#fafafa" }}
                key={resource.id + "_" + action.id}
            >
                <StickColumn
                    align={"left"}
                    className={classNames({
                        highlight: highlightRow == action.index,
                    })}
                    style={{
                        minWidth: 176,
                        background: "#fafafa",
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
