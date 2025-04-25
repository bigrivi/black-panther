import {
    Checkbox,
    CheckboxChangeEvent,
    Dropdown,
    Flex,
    MenuProps,
    Space,
    Table,
} from "antd";
import {
    FC,
    PropsWithChildren,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { IAction, IResource, IRole } from "@/interfaces";
import { DownOutlined } from "@ant-design/icons";
import { useStyles } from "./styled";
const headerItems: MenuProps["items"] = [
    {
        label: "Clear Permissions",
        key: "clear",
    },
    {
        label: "Allow All",
        key: "allowAll",
    },
];

type NestedEditorProps = {
    roles: IRole[];
    resources: IResource[];
    changedCount: number;
    filteredRoleIds: number[];
    filteredResourceIds: number[];
    selectedRoleActions: Record<string, number[]>;
    onActionSelectionChange: (
        checked: boolean,
        roleId: number,
        actionIds: number[]
    ) => void;
};

export const NestedEditor: FC<PropsWithChildren<NestedEditorProps>> = ({
    resources,
    roles,
    selectedRoleActions,
    onActionSelectionChange,
    changedCount,
    filteredResourceIds,
    filteredRoleIds,
}) => {
    const { styles } = useStyles();
    const [expandedRowKeys, setExpandedRowKeys] = useState<number[]>([]);
    const [hoverColumn, setHoverColumn] = useState<number>();
    const [hoverRow, setHoverRow] = useState<number>();

    const handleCellMouseEnter = (row: number, col: number) => {
        setHoverColumn(col);
        setHoverRow(row);
    };

    const handleCellMouseLeave = () => {
        setHoverColumn(undefined);
        setHoverRow(undefined);
    };

    const handleActionSelectChange = (
        e: CheckboxChangeEvent,
        roleId: number,
        actionIds: number[]
    ) => {
        onActionSelectionChange(e.target.checked, roleId, actionIds);
    };

    const handleHeaderClick = (key: string, roleId: number) => {
        const allActions: IAction[] | undefined = resources?.flatMap(
            (item) => item.actions as IAction[]
        );
        const allActionIds = allActions.map((item) => item.id);
        if (allActions && key == "allowAll") {
            onActionSelectionChange(true, roleId, allActionIds);
        } else if (key == "clear") {
            onActionSelectionChange(false, roleId, allActionIds);
        }
    };

    const scrollHeight = useMemo(() => {
        if (changedCount > 0) {
            return "calc(-300px + 100vh)";
        }
        return "calc(-250px + 100vh)";
    }, [changedCount]);

    useEffect(() => {
        if (resources && resources.length > 0) {
            setExpandedRowKeys(resources.map((item: IResource) => item.id));
        }
    }, [resources]);

    const filteredResources = useMemo(() => {
        if (filteredResourceIds.length > 0) {
            return resources.filter((item) =>
                filteredResourceIds.includes(item.id)
            );
        }
        return resources;
    }, [resources, filteredResourceIds]);

    const filteredRoles = useMemo(() => {
        if (filteredRoleIds.length > 0) {
            return roles.filter((item) => filteredRoleIds.includes(item.id));
        }
        return roles;
    }, [roles, filteredRoleIds]);

    return (
        <Table<IResource>
            className={styles.table}
            rowClassName={styles.row}
            dataSource={filteredResources}
            pagination={false}
            bordered
            rowKey={(record: any) => {
                if (record.resource_id) {
                    return record.id + "," + record.resource_id;
                }
                return record.id;
            }}
            scroll={{ x: 1000, y: scrollHeight }}
            expandable={{
                childrenColumnName: "actions",
                indentSize: 0,
                expandedRowKeys,
                onExpand(expanded, record: any) {
                    let newRowKeys = expandedRowKeys;
                    if (expanded) {
                        newRowKeys = [...newRowKeys, record.id];
                    } else {
                        newRowKeys = newRowKeys.filter((e) => e !== record.id);
                    }
                    setExpandedRowKeys(newRowKeys);
                },
            }}
        >
            <Table.Column
                fixed="left"
                dataIndex="name"
                width={200}
                title={"Resource"}
            />
            {filteredRoles.map((role, col) => {
                return (
                    <Table.Column
                        width={200}
                        key={role.id}
                        className={
                            hoverColumn == col
                                ? styles.highlightColumn
                                : undefined
                        }
                        render={(value, record, index) => {
                            const isActive =
                                hoverRow == record.index && col == hoverColumn;
                            if (record.actions) {
                                const allChecked = record.actions.every(
                                    (action: IAction) => {
                                        return selectedRoleActions[
                                            role.id + ""
                                        ]?.includes(action.id);
                                    }
                                );
                                return (
                                    <Flex
                                        justify="center"
                                        className={
                                            isActive
                                                ? styles.activeCell
                                                : undefined
                                        }
                                        style={{ height: 55 }}
                                        onMouseEnter={() =>
                                            handleCellMouseEnter(
                                                record.index,
                                                col
                                            )
                                        }
                                        onMouseLeave={handleCellMouseLeave}
                                    >
                                        <Checkbox
                                            onChange={(e) => {
                                                handleActionSelectChange(
                                                    e,
                                                    role.id,
                                                    record.actions.map(
                                                        (item: IAction) =>
                                                            item.id
                                                    )
                                                );
                                            }}
                                            indeterminate={
                                                record.actions.some(
                                                    (action: IAction) => {
                                                        return selectedRoleActions[
                                                            role.id + ""
                                                        ]?.includes(action.id);
                                                    }
                                                ) && !allChecked
                                            }
                                            checked={allChecked}
                                        />
                                    </Flex>
                                );
                            }
                            return (
                                <Flex
                                    justify="center"
                                    className={
                                        isActive ? styles.activeCell : undefined
                                    }
                                    style={{ height: 55 }}
                                    onMouseEnter={() =>
                                        handleCellMouseEnter(record.index, col)
                                    }
                                    onMouseLeave={handleCellMouseLeave}
                                >
                                    <Checkbox
                                        onChange={(e) => {
                                            handleActionSelectChange(
                                                e,
                                                role.id,
                                                [record.id]
                                            );
                                        }}
                                        checked={selectedRoleActions[
                                            role.id + ""
                                        ]?.includes(record.id)}
                                    />
                                </Flex>
                            );
                        }}
                        align="center"
                        title={
                            <Dropdown
                                menu={{
                                    items: headerItems,
                                    onClick: (evt) => {
                                        handleHeaderClick(evt.key, role.id);
                                    },
                                }}
                                trigger={["click"]}
                            >
                                <div
                                    className={styles.headerCell}
                                    onClick={(e) => e.preventDefault()}
                                >
                                    <Space>
                                        {role.name}
                                        <DownOutlined />
                                    </Space>
                                </div>
                            </Dropdown>
                        }
                    />
                );
            })}

            <Table.Column title={""} />
        </Table>
    );
};
