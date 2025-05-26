import type { CrudFilter, LogicalFilter } from "@refinedev/core";
import type { ColumnFilter } from "@tanstack/react-table";
import { MRT_ColumnDef } from "material-react-table";

type Params = {
    columns: MRT_ColumnDef<any, any>[];
    crudFilters: CrudFilter[];
};

export const crudFiltersToColumnFilters = ({
    columns,
    crudFilters,
}: Params): ColumnFilter[] => {
    return crudFilters
        .map((filter) => {
            if (filter.operator === "and" || filter.operator === "or") {
                if (filter.key) {
                    const filterId: string =
                        columns.find(
                            (col) =>
                                (col.meta as { filterKey?: string })
                                    ?.filterKey === filter.key
                        )?.id ?? filter.key;

                    return {
                        id: filterId,
                        operator: filter.operator,
                        value: filter.value,
                    };
                }
                return undefined;
            }
            return {
                id: (filter as LogicalFilter).field,
                operator: (filter as LogicalFilter).operator,
                value: filter.value,
            };
        })
        .filter(Boolean) as ColumnFilter[];
};
