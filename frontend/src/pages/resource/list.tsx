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
import { Button, Space, Table, TableColumnsType } from "antd";
import { Status } from "@/components";
import {
    MinusCircleTwoTone,
    PlusCircleTwoTone,
    PlusOutlined,
    RightOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { IDepartment } from "@/interfaces";
import { getExpandNodeIds } from "@/utils/getExpandNodeIds";

export const ResourceList = () => {
    const t = useTranslate();
    const go = useGo();
    const { tableProps } = useTable<IDepartment>({
        syncWithLocation: true,
    });

    const expandColumns: TableColumnsType = [
        {
            title: "Name",
            className: "action-name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Action",
            key: "operation",
            align: "right",
            render: () => (
                <Space size="middle">
                    <a>Pause</a>
                    <a>Stop</a>
                </Space>
            ),
        },
    ];

    const expandedRowRender = (record: any) => (
        <Table
            showHeader={false}
            columns={expandColumns}
            rowKey={"id"}
            dataSource={record.actions}
            pagination={false}
        />
    );

    return (
        <List>
            <Table
                {...tableProps}
                expandable={{
                    expandedRowRender,
                    indentSize: 0,
                    // childrenColumnName: "actions",
                }}
                rowKey="id"
            >
                <Table.Column dataIndex="name" width={200} title={"Name"} />
                <Table.Column dataIndex="key" width={200} title={"Key"} />
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
                    align="right"
                    render={(_, record: BaseRecord) => (
                        <Space>
                            {record.actions && (
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
                            )}

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
