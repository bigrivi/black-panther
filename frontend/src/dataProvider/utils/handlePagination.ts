import type { Pagination } from "@refinedev/core";
import { BetterCRUDQuery } from "../types";

export const handlePagination = (
  query: BetterCRUDQuery,
  pagination?: Pagination
) => {
  const { current = 1, pageSize = 10, mode = "server" } = pagination ?? {};

  if (mode === "server") {
    query = { ...query, page: current, size: pageSize };
  }

  return query;
};
