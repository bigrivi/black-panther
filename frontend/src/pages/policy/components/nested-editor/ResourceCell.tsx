import { BorderedCell } from "@/components";
import { IAction, IResource, IRole } from "@/interfaces";
import { Checkbox } from "@mui/material";
import classNames from "classnames";
import { FC } from "react";
import { usePolicyProviderContext } from "../../context";
import { useHighLightRowColumnContext } from "./context";
type ResourceCellProps = {
    resource: IResource;
    role: IRole;
    column: number;
};

export const ResourceCell: FC<ResourceCellProps> = ({
    role,
    resource,
    column,
}) => {
    const { selectedRoleActions, handleActionSelectionChange } =
        usePolicyProviderContext();
    const {
        setColumn,
        setRow,
        row: highlightRow,
        column: highlightColumn,
    } = useHighLightRowColumnContext();
    const allChecked = resource.actions!.every((action: IAction) => {
        return selectedRoleActions[role.id + ""]?.includes(action.id);
    });
    const handleActionSelectChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        roleId: number,
        actionIds: number[]
    ) => {
        handleActionSelectionChange(e.target.checked, roleId, actionIds);
    };

    const handleMouseEnter = () => {
        setColumn(column);
        setRow(resource.index);
    };
    const hadnleMouseLeave = () => {
        setColumn(undefined);
        setRow(undefined);
    };

    return (
        <BorderedCell
            onMouseEnter={handleMouseEnter}
            onMouseLeave={hadnleMouseLeave}
            className={classNames({
                ["highlight-both"]:
                    highlightRow == resource.index && highlightColumn == column,
                highlight:
                    highlightRow == resource.index || highlightColumn == column,
            })}
            align={"center"}
            style={{ minWidth: 176 }}
        >
            <Checkbox
                style={{ padding: 0 }}
                onChange={(e) => {
                    handleActionSelectChange(
                        e,
                        role.id,
                        resource.actions!.map((item: IAction) => item.id)
                    );
                }}
                indeterminate={
                    resource.actions!.some((action: IAction) => {
                        return selectedRoleActions[role.id + ""]?.includes(
                            action.id
                        );
                    }) && !allChecked
                }
                checked={allChecked}
            />
        </BorderedCell>
    );
};
