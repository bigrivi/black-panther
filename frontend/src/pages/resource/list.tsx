import {
    DateField,
    DeleteButton,
    EditButton,
    List,
    ShowButton,
    useTable,
} from "@refinedev/antd";
import {
    BaseKey,
    useCan,
    useDelete,
    useGo,
    useTranslate,
} from "@refinedev/core";
import { type BaseRecord } from "@refinedev/core";
import { Button, Popconfirm, Space, Table, TableColumnsType } from "antd";
import { Status } from "@/components";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { PropsWithChildren, useEffect, useState } from "react";
import { IAction, IResource } from "@/interfaces";
import { ActionDrawerForm } from "./components/drawer-action-form ";
import { useStyles } from "./styled";

export const ResourceList = ({ children }: PropsWithChildren) => {
    const t = useTranslate();
    const { mutate, isLoading } = useDelete();
    const { styles } = useStyles();

    const [actionDrawerOpen, setActionDrawerOpen] = useState(false);
    const [actionResourceId, setActionResourceId] = useState<BaseKey>();
    const [actionId, setActionId] = useState<BaseKey>();
    const [actionDrawerMode, setActionDrawerMode] = useState<
        "create" | "edit"
    >();

    const { data: canCreateAction } = useCan({
        resource: "resource",
        action: "create-action",
    });
    const { data: canEditAction } = useCan({
        resource: "resource",
        action: "edit-action",
    });
    const { data: canDeleteAction } = useCan({
        resource: "resource",
        action: "delete-action",
    });
    const { tableProps, tableQuery } = useTable<IResource>({
        syncWithLocation: true,
    });

    const expandColumns: TableColumnsType<IAction> = [
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
            render: (_, record: IAction) => (
                <Space>
                    {canEditAction?.can && (
                        <EditButton
                            hideText
                            size="small"
                            onClick={() => {
                                setActionDrawerOpen(true);
                                setActionResourceId(record.resource_id);
                                setActionDrawerMode("edit");
                                setActionId(record.id);
                            }}
                            recordItemId={record.id}
                        />
                    )}
                    {canDeleteAction?.can && (
                        <Popconfirm
                            key="delete"
                            okText={"OK"}
                            cancelText={"Cancel"}
                            okType="danger"
                            title={"Are your sure"}
                            okButtonProps={{ disabled: isLoading }}
                            onConfirm={() => {
                                mutate(
                                    {
                                        resource: `resource/${record.resource_id}/action`,
                                        id: record.id,
                                    },
                                    {
                                        onSuccess: () => {
                                            tableQuery.refetch();
                                        },
                                    }
                                );
                            }}
                        >
                            <Button
                                danger
                                icon={<DeleteOutlined />}
                                size="small"
                                onClick={() => {}}
                            ></Button>
                        </Popconfirm>
                    )}
                </Space>
            ),
        },
    ];

    const expandedRowRender = (record: any) => (
        <Table
            rootClassName={styles.actionRow}
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
                            {record.actions && canCreateAction?.can && (
                                <Button
                                    icon={<PlusOutlined />}
                                    size="small"
                                    onClick={() => {
                                        setActionDrawerOpen(true);
                                        setActionResourceId(record.id);
                                        setActionDrawerMode("create");
                                        setActionId(undefined);
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
            {children}
            {actionResourceId && (
                <ActionDrawerForm
                    open={actionDrawerOpen}
                    resourceId={actionResourceId}
                    action={actionDrawerMode!}
                    id={actionId}
                    onClose={() => {
                        setActionDrawerOpen(false);
                        setActionResourceId(undefined);
                    }}
                    onMutationSuccess={() => {
                        setActionDrawerOpen(false);
                        tableQuery.refetch();
                    }}
                />
            )}
        </List>
    );
};
