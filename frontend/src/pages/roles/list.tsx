import {
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
import { getDefaultFilter, type BaseRecord } from "@refinedev/core";
import { Button, Radio, Space, Table } from "antd";
import { Status } from "../../components/status";
import { EyeFilled } from "@ant-design/icons";

export const RoleList = () => {
    const t = useTranslate();
    const go = useGo();
    const { tableProps, filters } = useTable({
        syncWithLocation: true,
    });

    const handleAuthorize = () => {
        go({
            to: "/roles/authorize",
            options: { keepQuery: false },
        });
    };

    return (
        <List
            headerButtons={({ defaultButtons }) => (
                <>
                    {defaultButtons}
                    <Button onClick={handleAuthorize} icon={<EyeFilled />}>
                        Authorize Permission
                    </Button>
                </>
            )}
        >
            <Table {...tableProps} rowKey="id">
                <Table.Column dataIndex="id" title={"ID"} />
                <Table.Column dataIndex="name" title={"Name"} />
                <Table.Column
                    dataIndex="valid_state"
                    title="Status"
                    sorter={{ multiple: 3 }}
                    render={(value) => {
                        return <Status value={value} />;
                    }}
                    defaultFilteredValue={getDefaultFilter("status", filters)}
                    filterDropdown={(props) => (
                        <FilterDropdown {...props}>
                            <Radio.Group>
                                <Radio value="1">
                                    {t(`fields.status.true`)}
                                </Radio>
                                <Radio value="0">
                                    {t(`fields.status.false`)}
                                </Radio>
                            </Radio.Group>
                        </FilterDropdown>
                    )}
                />
                <Table.Column
                    sorter
                    dataIndex="created_at"
                    render={(value) => <DateField value={value} format="LLL" />}
                    title={t(`fields.createdAt`)}
                />
                <Table.Column
                    title={"Actions"}
                    dataIndex="actions"
                    render={(_, record: BaseRecord) => (
                        <Space>
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
