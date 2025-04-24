import type { CrudOperators } from "@refinedev/core";

export const mapOperator = (operator: CrudOperators): string => {
  switch (operator) {
    case "and":
      return "$and";
    case "or":
      return "$or";
    case "eq":
      return "$eq";
    case "ne":
      return "$ne";
    case "lt":
      return "$lt";
    case "gt":
      return "$gt";
    case "lte":
      return "$lte";
    case "gte":
      return "$gte";
    case "in":
      return "$in";
    case "nin":
      return "$notin";
    case "contains":
      return "$contL";
    case "ncontains":
      return "$exclL";
    case "containss":
      return "$cont";
    case "ncontainss":
      return "$excl";
    case "null":
      return "$isnull";
    case "nnull":
      return "$notnull";
    case "startswith":
      return "$startsL";
    case "startswiths":
      return "$starts";
    case "endswith":
      return "$endsL";
    case "endswiths":
      return "$ends";
    case "between":
      return "$between";
  }

  return "$eq";
};
