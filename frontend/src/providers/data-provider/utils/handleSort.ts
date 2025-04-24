import type { CrudSorting } from "@refinedev/core";
import { BetterCRUDQuery } from "../types";

export const handleSort = (query: BetterCRUDQuery, sorters?: CrudSorting) => {
  if (sorters && sorters.length) {
    const sort = sorters?.map(({ field, order }) => {
      return `${field},${order.toUpperCase()}`;
    });
    query = { ...query, sort };
  }
  return query;
};
