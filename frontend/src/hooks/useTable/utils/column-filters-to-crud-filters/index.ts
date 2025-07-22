import type { CrudFilter, CrudOperators } from "@refinedev/core";
import type { ColumnFiltersState } from "@tanstack/react-table";
import dayjs from "dayjs";
import {
    MRT_ColumnFilterFnsState,
    MRT_FilterOption,
} from "material-react-table";

type Params = {
    columnFilters?: ColumnFiltersState;
    columnFilterFns: MRT_ColumnFilterFnsState;
};

export const transformOperatorToCrudOperator = (
    operatorValue?: MRT_FilterOption
): Exclude<CrudOperators, "or" | "and"> => {
    if (!operatorValue) {
        return "eq";
    }

    switch (operatorValue) {
        case "equals":
        case "is":
        case "=":
            return "eq";
        case "!=":
        case "notEquals":
            return "ne";
        case "contains":
        case "fuzzy":
            return "contains";
        case "isAnyOf":
            return "in";
        case "between":
            return "between";
        case ">":
        case "greaterThan":
            return "gt";
        case ">=":
        case "greaterThanOrEqualTo":
            return "gte";
        case "<":
        case "lessThan":
            return "lt";
        case "<=":
        case "lessThanOrEqualTo":
            return "lte";
        case "startsWith":
            return "startswith";
        case "endsWith":
            return "endswith";
        case "empty":
            return "null";
        case "notEmpty":
            return "nnull";
        default:
            return operatorValue as Exclude<CrudOperators, "or" | "and">;
    }
};

export const columnFiltersToCrudFilters = ({
    columnFilters,
    columnFilterFns,
}: Params): CrudFilter[] => {
    return (
        columnFilters?.map((filter) => {
            const operator = columnFilterFns[filter.id];
            const defaultOperator = Array.isArray(filter.value) ? "in" : "eq";
            let value = ["empty", "notEmpty"].includes(operator)
                ? true
                : filter.value;
            if (Array.isArray(value)) {
                value = value.map((ele) => {
                    if (dayjs.isDayjs(ele)) {
                        return dayjs(ele).format("YYYY-MM-DD HH:mm:ss");
                    }
                    return ele;
                });
                if (Array.isArray(value) && value.every((ele) => !!!ele)) {
                    value = [];
                }
            } else if (value === "true") {
                value = true;
            } else if (value === "false") {
                value = false;
            }

            return {
                field: filter.id,
                operator:
                    transformOperatorToCrudOperator(operator) ??
                    defaultOperator,
                value,
            };
        }) ?? []
    );
};
