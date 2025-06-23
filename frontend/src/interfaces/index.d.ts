import type { Column } from "@tanstack/react-table";

export type Nullable<T> = {
    [P in keyof T]: T[P] | null;
};

interface ITreeNode {
    label?: string;
    value?: string | number;
    children?: ITreeNode[];
    [key: string]: any;
}

export interface ITag {
    id: number;
    title: string;
}

export interface ICategory {
    id: number;
    title: string;
}

export interface IPost {
    id: number;
    title: string;
    content: string;
    status: "published" | "draft" | "rejected";
    category: { id: number };
    tags: number[];
}

export interface ColumnButtonProps {
    column: Column<any, any>; // eslint-disable-line
}

export interface FilterElementProps {
    value: any; // eslint-disable-line
    onChange: (value: any) => void; // eslint-disable-line
}

interface IDepartment {
    id: number;
    name: string;
    parent_id?: number;
    created_at: string;
    path?: string;
    children?: IDepartment[];
    valid_state?: boolean;
}

interface IRole {
    id: number;
    name: string;
    code: string;
    description?: string;
    created_at: string;
    actions?: IAction[];
    valid_state?: boolean;
}

interface IAction {
    id: number;
    name: string;
    resource_id?: number;
    [key: string]: any;
}

interface IResource {
    id: number;
    name: string;
    key: string;
    actions?: IAction[];
    [key: string]: any;
}

interface IUser {
    id: number;
    login_name: string;
    user_name: string;
    created_at: string;
    roles: IRole[];
    positions: IPostion[];
    is_active?: boolean;
    is_superuser?: boolean;
    email?: string;
    department_id?: number;
    department?: IDepartment;
}

interface IPostion {
    id: number;
    name: string;
    code: string;
    created_at: string;
    description?: string;
    valid_state?: boolean;
}

interface IEnum {
    id: number;
    name: string;
    key: string;
    description?: string;
    created_at: string;
    valid_state?: boolean;
    items?: IEnumOption[];
}

interface IEnumOption {
    key?: string;
    id: number;
    name: string;
    value: string;
    valid_state?: boolean;
    description?: string;
}

interface IParameter {
    id: number;
    name: string;
    key: string;
    value: string;
    description?: string;
    created_at: string;
    is_system?: boolean;
}

interface IFieldOption {
    value: any;
    label: string;
}

export type SchemeDataType =
    | "object"
    | "boolean"
    | "string"
    | "array"
    | "integer"
    | "null";

type SchemaValueType =
    | "text"
    | "textarea"
    | "switch"
    | "checkbox"
    | "select"
    | "listTable";

interface IFieldSchema {
    name: string;
    title: string;
    type?: SchemeDataType;
    anyOf?: { type?: SchemeDataType; $ref?: string }[];
    valueType: SchemaValueType;
    description?: string;
    options?: IFieldOption[];
    schema?: Schema;
    items?: { $ref: string };
    default?: any;
}

export interface Schema {
    title?: string;
    name: string;
    type?: SchemeDataType;
    description?: string;
    properties: Properties;
    required?: string[];
    $defs?: Record<string, Schema>;
}

export interface Properties {
    [key: string]: IFieldSchema;
}
