import { Edit, useForm } from "@refinedev/antd";
import { useList } from "@refinedev/core";
import { Form, Input, TreeSelect } from "antd";

export const DepartmentEdit = () => {
    const { formProps, saveButtonProps } = useForm({});
    const { data: deptTreeData } = useList({
        resource: "dept",
        meta: {
            isTree: true,
        },
    });

    return (
        <Edit saveButtonProps={saveButtonProps}>
            <Form {...formProps} layout="vertical">
                <Form.Item
                    label={"Name"}
                    name={["name"]}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label={"Parent Department"}
                    name={["parent_id"]}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <TreeSelect
                        showSearch
                        style={{ width: "100%" }}
                        dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                        placeholder="Please select"
                        allowClear
                        fieldNames={{
                            label: "name",
                            value: "id",
                        }}
                        treeDefaultExpandAll
                        treeData={deptTreeData?.data}
                    />
                </Form.Item>
            </Form>
        </Edit>
    );
};
