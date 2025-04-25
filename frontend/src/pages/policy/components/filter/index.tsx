import { IAction, IResource, IRole } from "@/interfaces";
import { SearchOutlined } from "@ant-design/icons";
import { Select } from "antd";
import { FC } from "react";
type FilterProps = {
    resources: IResource[];
    roles: IRole[];
    onChange: (value: string[]) => void;
};
export const Filter: FC<FilterProps> = ({ resources, roles, onChange }) => {
    const handleChange = (value: string[]) => {
        onChange(value);
    };
    return (
        <Select
            style={{ width: 400 }}
            mode="multiple"
            placeholder="Filter Polices"
            onChange={handleChange}
            suffixIcon={<SearchOutlined />}
            maxTagCount={3}
            options={[
                {
                    label: <span>Roles</span>,
                    title: "roles",
                    options: roles.map((item) => {
                        return {
                            label: <span>{item.name}</span>,
                            value: "role_" + item.id,
                        };
                    }),
                },
                {
                    label: <span>Resources</span>,
                    title: "resources",
                    options: resources.map((item) => {
                        return {
                            label: <span>{item.name}</span>,
                            value: "resource_" + item.id,
                        };
                    }),
                },
            ]}
        />
    );
};
