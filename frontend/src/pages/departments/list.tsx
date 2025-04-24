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
import { useGo, useTranslate } from "@refinedev/core";
import { type BaseRecord } from "@refinedev/core";
import { Button, Space, Table } from "antd";
import { Status } from "@/components";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { IDepartment } from "@/interfaces";
import { getExpandNodeIds } from "@/utils/getExpandNodeIds";

export const DepartmentList = () => {
    const t = useTranslate();
    const go = useGo();
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);
    const { tableProps } = useTable<IDepartment>({
        syncWithLocation: true,
        meta: {
            isTree: true,
        },
    });

    useEffect(() => {
        if (tableProps.dataSource && tableProps.dataSource.length > 0) {
            setExpandedRowKeys(
                getExpandNodeIds<IDepartment>(tableProps?.dataSource[0])
            );
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
