import { Card, Checkbox, Dropdown, MenuProps, Space, Table } from "antd";
import { FC, PropsWithChildren, useMemo } from "react";
import { IAction, IResource, IRole } from "@/interfaces";
import { DownOutlined, MoreOutlined } from "@ant-design/icons";
import { useStyles } from "./styled";
import { zip } from "@/utils/zip";
import { usePolicyProviderContext } from "../../context";
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

type RoleEditorProps = {
    role: IRole;
    resources: IResource[];
    selectedRoleActions: Record<string, number[]>;
};

export const RoleEditor: FC<PropsWithChildren<RoleEditorProps>> = ({
    resources,
    role,
    selectedRoleActions,
}) => {
    const { styles } = useStyles();
    const { handleActionSelectionChange } = usePolicyProviderContext();

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

    const handleHeaderClick = (key: string, actions: IAction[]) => {
        const allActionIds = actions.map((item) => item.id);
        if (actions && key == "allowAll") {
            handleActionSelectionChange(true, role.id, allActionIds);
        } else if (key == "clear") {
            handleActionSelectionChange(false, role.id, allActionIds);
        }
    };

    const handleMoreClick = (key: string) => {
        const allActionIds: number[] = resources.flatMap((item) =>
            item.actions!.map((item) => item.id)
        );
        if (key == "allowAll") {
            handleActionSelectionChange(true, role.id, allActionIds);
        } else if (key == "clear") {
            handleActionSelectionChange(false, role.id, allActionIds);
        }
    };

    return (
        <Card
            title={role.name}
            extra={[
                <Dropdown
                    key={"moreAction"}
                    menu={{
                        items: [
                            {
                                key: "title",
                                label: role.name,
                                type: "group",
                            },
                            {
                                type: "divider",
                            },
                            ...headerItems,
                        ],
                        onClick: (evt) => {
                            handleMoreClick(evt.key);
                        },
                    }}
                    trigger={["click"]}
                >
                    <MoreOutlined
                        role="button"
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    />
                </Dropdown>,
            ]}
            styles={{ body: { padding: 0, overflow: "hidden" } }}
        >
            <Table
                className={styles.table}
                rowClassName={styles.row}
                dataSource={dataSource}
                rowKey={"id"}
                pagination={false}
                scroll={{ x: 200 * resources.length }}
                bordered
            >
                {resources.map((resource, columnIndex) => {
                    return (
                        <Table.Column
                            width={200}
                            key={resource.id}
                            title={
                                <Dropdown
                                    menu={{
                                        items: headerItems,
                                        onClick: (evt) => {
                                            handleHeaderClick(
                                                evt.key,
                                                resource.actions!
                                            );
                                        },
                                    }}
                                    trigger={["click"]}
                                >
                                    <div
                                        className={styles.headerCell}
                                        onClick={(e) => e.preventDefault()}
                                    >
                                        <Space>
                                            {resource.name}
                                            <DownOutlined />
                                        </Space>
                                    </div>
                                </Dropdown>
                            }
                            render={(value, record, index) => {
                                const data = record["col_" + columnIndex];
                                if (!data) {
                                    return null;
                                }
                                return (
                                    <Checkbox
                                        onChange={(e) => {
                                            handleActionSelectionChange(
                                                e.target.checked,
                                                role.id,
                                                [data.id]
                                            );
                                        }}
                                        checked={selectedRoleActions[
                                            role.id + ""
                                        ]?.includes(data.id)}
                                    >
                                        {data.name}
                                    </Checkbox>
                                );
                            }}
                        />
                    );
                })}
                <Table.Column title="" />
            </Table>
        </Card>
    );
};
