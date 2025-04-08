from typing import Any, Sequence, TypedDict, List
from sqlmodel import SQLModel


class TreeNodeProtocol(TypedDict, total=False):
    id: str
    sort: int | None
    parent_id: str | None


def get_tree_nodes(rows: Sequence[SQLModel]) -> List[TreeNodeProtocol]:
    tree_nodes: List[TreeNodeProtocol] = [item.model_dump() for item in rows]
    tree_nodes.sort(key=lambda x: x.get("sort")
                    if "sort" in x else x.get("id"))
    return tree_nodes


def traversal_to_tree(nodes: List[TreeNodeProtocol]) -> list[dict[str, Any]]:
    tree = []
    node_dict = {node["id"]: node for node in nodes}
    for node in nodes:
        parent_id = node['parent_id']
        if parent_id is None:
            tree.append(node)
        else:
            parent_node = node_dict.get(parent_id)
            if parent_node is not None:
                if 'children' not in parent_node:
                    parent_node['children'] = []
                if node not in parent_node['children']:
                    parent_node['children'].append(node)
            else:
                if node not in tree:
                    tree.append(node)
    return tree


def get_tree_data(
    rows: Sequence[SQLModel]
) -> List[dict[str, Any]]:
    nodes = get_tree_nodes(rows)
    return traversal_to_tree(nodes)
