import {
    useMany,
    getDefaultFilter,
    useResource,
    useGetIdentity,
} from "@refinedev/core";

import {
    List,
    TextField,
    EditButton,
    ShowButton,
    FilterDropdown,
    TagField,
    useTable,
    useSelect,
    DeleteButton,
} from "@refinedev/antd";

import { Table, Space, Select, Radio, Input } from "antd";

import type { IPost, ICategory } from "../../interfaces";

export const UserList = () => {
    const { resource } = useResource();
    const { tableProps, filters } = useTable<IPost>({
        syncWithLocation: false,
        resource: resource?.name,
        filters: {
            initial: [
                {
                    field: "title",
                    operator: "contains",
                    value: "",
                },
            ],
        },
    });

    //   const { selectProps: categorySelectProps } = useSelect<ICategory>({
    //     resource: "category",
    //     optionLabel: "title",
    //     optionValue: "id",
    //     defaultValue: getDefaultFilter("category.id", filters, "in"),
    //   });

    return (
        <List>
            <Table {...tableProps} rowKey="id">
                <Table.Column
                    dataIndex="id"
                    title="ID"
                    sorter={{ multiple: 1 }}
                />
                <Table.Column
                    dataIndex="user_name"
                    sorter={{ multiple: 2 }}
                    defaultFilteredValue={getDefaultFilter(
                        "title",
                        filters,
                        "contains"
                    )}
                    filterDropdown={(props) => (
                        <FilterDropdown {...props}>
                            <Input />
                        </FilterDropdown>
                    )}
                    title="User Name"
                />
                <Table.Column
                    dataIndex="login_name"
                    sorter={{ multiple: 2 }}
                    defaultFilteredValue={getDefaultFilter(
                        "title",
                        filters,
                        "contains"
                    )}
                    filterDropdown={(props) => (
                        <FilterDropdown {...props}>
                            <Input />
                        </FilterDropdown>
                    )}
                    title="Login Name"
                />
                {/* <Table.Column
          dataIndex={["category", "id"]}
          title="Category"
          sorter
          render={(value, record) => {
            return <TextField value={record["category"]["title"]} />;
          }}
          filterDropdown={(props) => (
            <FilterDropdown
              {...props}
              mapValue={(selectedKeys) => selectedKeys.map(Number)}
            >
              <Select
                style={{ minWidth: 200 }}
                mode="multiple"
                placeholder="Select Category"
                {...categorySelectProps}
              />
            </FilterDropdown>
          )}
          defaultFilteredValue={getDefaultFilter("category.id", filters, "in")}
        /> */}
                <Table.Column
                    dataIndex="status"
                    title="Status"
                    sorter={{ multiple: 3 }}
                    render={(value: string) => <TagField value={value} />}
                    defaultFilteredValue={getDefaultFilter("status", filters)}
                    filterDropdown={(props) => (
                        <FilterDropdown {...props}>
                            <Radio.Group>
                                <Radio value="published">Published</Radio>
                                <Radio value="draft">Draft</Radio>
                                <Radio value="rejected">Rejected</Radio>
                            </Radio.Group>
                        </FilterDropdown>
                    )}
                />
                <Table.Column<IPost>
                    title="Actions"
                    dataIndex="actions"
                    render={(_, record) => (
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
