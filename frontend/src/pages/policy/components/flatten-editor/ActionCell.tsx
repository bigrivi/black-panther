import { BorderedCell } from "@/components";
import { IAction } from "@/interfaces";
import { Checkbox, FormControlLabel } from "@mui/material";
import { FC } from "react";
import { usePolicyProviderContext } from "../../context";

type ActionCellProps = {
    data?: IAction;
    roleId: number;
};
export const ActionCell: FC<ActionCellProps> = ({ data, roleId }) => {
    const { selectedRoleActions, handleActionSelectionChange } =
        usePolicyProviderContext();

    if (!data) {
        return (
            <BorderedCell
                style={{
                    minWidth: 176,
                    width: 176,
                }}
            ></BorderedCell>
        );
    }
    const checked = selectedRoleActions[roleId + ""]
        ? selectedRoleActions[roleId + ""].includes(data.id)
        : false;
    return (
        <BorderedCell
            style={{
                minWidth: 176,
                width: 176,
            }}
        >
            <FormControlLabel
                control={
                    <Checkbox
                        style={{ paddingTop: 0, paddingBottom: 0 }}
                        onChange={(e) => {
                            handleActionSelectionChange(
                                e.target.checked,
                                roleId,
                                [data.id]
                            );
                        }}
                        checked={checked}
                    />
                }
                label={data.name}
            />
        </BorderedCell>
    );
};
