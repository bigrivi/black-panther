type BasicDataNode = Record<string, any>;

type FieldNames<T> = {
    label: T;
    value: T;
    children: T;
};

const defaultFilterMatcher = <T extends BasicDataNode>(
    filterText: string,
    node: T,
    fieldNames: FieldNames<keyof T>
) => {
    return (
        node[fieldNames.label]
            .toLowerCase()
            .indexOf(filterText.toLowerCase()) !== -1
    );
};

export const hasChildren = <T extends BasicDataNode>(
    node: T,
    fieldNames: FieldNames<keyof T>
) => {
    if (!node[fieldNames.children]) {
        return false;
    }

    if (node[fieldNames.children].length == 0) {
        return false;
    }
    return true;
};

const findMatchNode = <T extends BasicDataNode>(
    node: T,
    filterText: string,
    fieldNames: FieldNames<keyof T>,
    matcher = defaultFilterMatcher<T>
): T | undefined => {
    if (matcher(filterText, node, fieldNames)) {
        return node;
    }
    if (hasChildren(node, fieldNames)) {
        return node[fieldNames.children].find((child: T) =>
            findMatchNode(child, filterText, fieldNames, matcher)
        );
    }
};

export const getExpandFilteredNodeIds = <T, Y extends BasicDataNode>(
    nodes: Array<Y>,
    filterText: string,
    fieldNames: FieldNames<keyof Y>,
    matcher = defaultFilterMatcher<Y>
): T[] => {
    return nodes
        .filter((child) => {
            return findMatchNode(child, filterText, fieldNames, matcher);
        })
        .reduce((acc: T[], item) => {
            if (item[fieldNames.children] && item[fieldNames.children].length) {
                return acc.concat(item[fieldNames.value], [
                    ...getExpandFilteredNodeIds<T, Y>(
                        item[fieldNames.children],
                        filterText,
                        fieldNames
                    ),
                ]);
            }
            return acc;
        }, []);
};

export const getTreeExpandAllNodeIds = <T extends BasicDataNode>(
    nodes: T[],
    idKey: string = "id",
    childrenKey: string = "children"
): T[] => {
    return nodes.reduce((acc: T[], item) => {
        if (item[childrenKey] && item[childrenKey].length) {
            return acc.concat(item[idKey], [
                ...getTreeExpandAllNodeIds<T>(item[childrenKey], idKey),
            ]);
        }
        return acc;
    }, []);
};

export const filterTree = <T extends BasicDataNode>(
    nodes: T[],
    filterText: string,
    fieldNames: FieldNames<keyof T>,
    matcher = defaultFilterMatcher<T>
): T[] => {
    return nodes
        .filter((child: T) => {
            return findMatchNode(child, filterText, fieldNames, matcher);
        })
        .map((node: T) => {
            if (
                matcher(filterText, node, fieldNames) &&
                !hasChildren(node, fieldNames)
            ) {
                return node;
            }

            const filtered = hasChildren(node, fieldNames)
                ? filterTree(
                      node[fieldNames.children],
                      filterText,
                      fieldNames,
                      matcher
                  )
                : [];
            return {
                ...node,
                children: [...filtered],
            };
        });
};
