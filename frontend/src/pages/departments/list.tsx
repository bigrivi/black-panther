import {
    CreateButton,
    DateField,
    DeleteButton,
    EditButton,
    FilterDropdown,
    List,
    ShowButton,
    TagField,
    useTable,
} from "@refinedev/antd";
import { useGo, useNavigation, useTranslate } from "@refinedev/core";
import { getDefaultFilter, type BaseRecord } from "@refinedev/core";
import { Button, Radio, Space, Table } from "antd";
import { Status } from "../../components/status";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useMemo, useState } from "react";

export const getExpandNodeIds = (node: any): number[] => {
    return node.children.reduce((acc: any, child: any) => {
        if (child.children && child.children.length) {
            return acc.concat([child.id, ...getExpandNodeIds(child)]);
        }
        return acc.concat(child.id);
    }, []);
};

export const DepartmentList = () => {
    const t = useTranslate();
    const go = useGo();
    const [expandedRowKeys, setExpandedRowKeys] = useState([1, 2]);
    const { tableProps, filters } = useTable({
        syncWithLocation: true,
        meta: {
            isTree: true,
        },
    });

    useEffect(() => {
        if (tableProps.dataSource && tableProps.dataSource.length > 0) {
            setExpandedRowKeys([
                tableProps?.dataSource[0].id as number,
                ...getExpandNodeIds(tableProps?.dataSource[0]),
            ]);
        }
    }, [tableProps.dataSource]);

    return (
        <List>
            <Table
                {...tableProps}
                expandable={{
                    childrenColumnName: "children",
                    onExpand(expanded, record: any) {
                        let newRowKeys = expandedRowKeys;
                        if (expanded) {
                            newRowKeys = [...newRowKeys, record.id];
                        } else {
                            newRowKeys = newRowKeys.filter(
                                (e) => e !== record.id
                            );
                        }
                        setExpandedRowKeys(newRowKeys);
                    },
                    expandedRowKeys,
                }}
                rowKey="id"
            >
                <Table.Column dataIndex="name" title={"Name"} />
                <Table.Column
                    dataIndex="valid_state"
                    title="Status"
                    render={(value) => {
                        return <Status value={value} />;
                    }}
                />
                <Table.Column
                    dataIndex="created_at"
                    render={(value) => <DateField value={value} format="LLL" />}
                    title={t(`fields.createdAt`)}
                />
                <Table.Column
                    title={"Actions"}
                    dataIndex="actions"
                    render={(_, record: BaseRecord) => (
                        <Space>
                            <Button
                                icon={<PlusOutlined />}
                                size="small"
                                onClick={() => {
                                    go({
                                        to: "/departments/create",
                                        query: {
                                            parent_id: record.id,
                                        },
                                    });
                                }}
                            ></Button>
                            <EditButton
                                hideText
                                size="small"
                                recordItemId={record.id}
                            />
                            <ShowButton
                                hideText
                                size="small"
                                recordItemId={record.id}
                            />
                            <DeleteButton
                                hideText
                                size="small"
                                recordItemId={record.id}
                            />
                        </Space>
                    )}
                />
            </Table>
        </List>
    );
};
