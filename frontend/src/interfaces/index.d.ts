import type { Column } from "@tanstack/react-table";

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

interface ITreeNode {
    id: number;
    children?: ITreeNode[];
    [key: string]: any;
}

interface IDepartment {
    id: number;
    name: string;
    parent_id?: number;
    children?: IDepartment[];
}

interface IAction {
    id: number;
    name: string;
}

interface IResource {
    id: number;
    name: string;
    key: string;
    actions?: IAction[];
}
