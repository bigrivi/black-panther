import { ITreeNode } from "@/interfaces";

export const getExpandNodeIds = <T extends ITreeNode>(node: T): number[] => {
    return [
        node.id,
        ...node.children!.reduce((acc: number[], child) => {
            if (child.children && child.children.length) {
                return acc.concat([...getExpandNodeIds(child)]);
            }
            return acc.concat(child.id);
        }, []),
    ];
};
