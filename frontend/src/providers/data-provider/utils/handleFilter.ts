import type { CrudFilters, CrudFilter } from "@refinedev/core";
import { BetterCRUDQuery, SCondition } from "../types";
import { mapOperator } from "./mapOperator";

function isEmpty(value: any) {
  if (Array.isArray(value)) {
    return value.length == 0;
  }
  return (
    value == null ||
    value == undefined ||
    (typeof value === "string" && value.trim().length === 0)
  );
}

export const generateSearchFilter = (filters: CrudFilters): SCondition => {
  return createSearchQuery({
    operator: "and",
    value: filters,
  });
};

export const createSearchQuery = (filter: CrudFilter): SCondition => {
  if (
    filter.operator !== "and" &&
    filter.operator !== "or" &&
    "field" in filter
  ) {
    return {
      [filter.field]: {
        [mapOperator(filter.operator)]: Array.isArray(filter.value)
          ? filter.value.join(",")
          : filter.value,
      },
    };
  }

  const { operator, value } = filter;

  return {
    [mapOperator(operator)]: value.map((filter) => createSearchQuery(filter)),
  };
};

export const handleFilter = (query: BetterCRUDQuery, filters?: CrudFilters) => {
  if (Array.isArray(filters) && filters.length > 0) {
    const search = generateSearchFilter(
      filters.filter((filter) => {
        return !isEmpty(filter.value);
      })
    );
    if (search && search["$and"]?.length) {
      query = { ...query, s: JSON.stringify(search) };
    }
  }
  return query;
};
