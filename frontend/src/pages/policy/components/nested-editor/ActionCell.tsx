import { FC } from "react";
import { IAction, IRole } from "@/interfaces";
import { BorderedCell } from "../common/BorderedCell";
import { Checkbox } from "@mui/material";
import { usePolicyProviderContext } from "../../context";
import { useHighLightRowColumnContext } from "./context";
import classNames from "classnames";
type ActionCellProps = {
    role: IRole;
    action: IAction;
    column: number;
};
export const ActionCell: FC<ActionCellProps> = ({ role, action, column }) => {
    const { selectedRoleActions, handleActionSelectionChange } =
        usePolicyProviderContext();
    const {
        setColumn,
        setRow,
        row: highlightRow,
        column: highlightColumn,
    } = useHighLightRowColumnContext();
    const handleActionSelectChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        roleId: number,
        actionIds: number[]
    ) => {
        handleActionSelectionChange(e.target.checked, roleId, actionIds);
    };
    const handleMouseEnter = () => {
        setColumn(column);
        setRow(action.index);
    };
    const hadnleMouseLeave = () => {
        setColumn(undefined);
        setRow(undefined);
    };
    const checked = selectedRoleActions[role.id + ""]
        ? selectedRoleActions[role.id + ""].includes(action.id)
        : false;
    return (
        <BorderedCell
            key={role.id}
            align={"center"}
            className={classNames({
                ["highlight-both"]:
                    highlightRow == action.index && highlightColumn == column,
                highlight:
                    highlightRow == action.index || highlightColumn == column,
            })}
            style={{
                minWidth: 176,
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={hadnleMouseLeave}
        >
            <Checkbox
                style={{ padding: 0 }}
                onChange={(e) => {
                    handleActionSelectChange(e, role.id, [action.id]);
                }}
                checked={checked}
            />
        </BorderedCell>
    );
};
