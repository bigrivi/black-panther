import {
    type BaseRecord,
    CrudFilter,
    type CrudSorting,
    type HttpError,
    useTable as useTableCore,
    type useTableProps as useTablePropsCore,
    type useTableReturnType as useTableReturnTypeCore,
} from "@refinedev/core";
import {
    ColumnFiltersState,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
} from "@tanstack/react-table";

import {
    type MRT_TableInstance,
    type MRT_TableOptions,
    useMaterialReactTable,
} from "material-react-table";

import isEqual from "lodash/isEqual";
import { useEffect, useState } from "react";

import {
    columnFiltersToCrudFilters,
    crudFiltersToColumnFilters,
    getRemovedFilters,
    useIsFirstRender,
} from "./utils";

export type UseTableReturnType<
    TData extends BaseRecord = BaseRecord,
    TError extends HttpError = HttpError
> = MRT_TableInstance<TData> & {
    refineCore: useTableReturnTypeCore<TData, TError>;
};

export type UseTableProps<
    TQueryFnData extends BaseRecord = BaseRecord,
    TError extends HttpError = HttpError,
    TData extends BaseRecord = TQueryFnData
> = {
    /**
     * Configuration object for the core of the [useTable](/docs/api-reference/core/hooks/useTable/)
     * @type [`useTablePropsCore<TQueryFnData, TError>`](/docs/api-reference/core/hooks/useTable/#properties)
     */
    refineCoreProps?: useTablePropsCore<TQueryFnData, TError, TData>;
} & Pick<MRT_TableOptions<TData>, "columns"> &
    Partial<Omit<MRT_TableOptions<TData>, "columns">>;

export function useTable<
    TQueryFnData extends BaseRecord = BaseRecord,
    TError extends HttpError = HttpError,
    TData extends BaseRecord = TQueryFnData
>({
    refineCoreProps: { hasPagination = true, ...refineCoreProps } = {},
    initialState: reactTableInitialState = {},
    ...rest
}: UseTableProps<TQueryFnData, TError, TData>): UseTableReturnType<
    TData,
    TError
> {
    const isFirstRender = useIsFirstRender();

    const useTableResult = useTableCore<TQueryFnData, TError, TData>({
        ...refineCoreProps,
        hasPagination,
    });

    const isServerSideFilteringEnabled =
        (refineCoreProps.filters?.mode || "server") === "server";
    const isServerSideSortingEnabled =
        (refineCoreProps.sorters?.mode || "server") === "server";
    const hasPaginationString = hasPagination === false ? "off" : "server";
    const isPaginationEnabled =
        (refineCoreProps.pagination?.mode ?? hasPaginationString) !== "off";

    const {
        tableQuery: { data, isLoading, isRefetching, isError },
        current,
        setCurrent,
        pageSize: pageSizeCore,
        setPageSize: setPageSizeCore,
        sorters,
        setSorters,
        filters: filtersCore,
        setFilters,
        pageCount,
    } = useTableResult;
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]); // can set initial column filter state here

    const reactTableResult = useMaterialReactTable<TData>({
        data: data?.data ?? [],
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: isServerSideSortingEnabled
            ? undefined
            : getSortedRowModel(),
        getFilteredRowModel: isServerSideFilteringEnabled
            ? undefined
            : getFilteredRowModel(),
        onColumnFiltersChange: setColumnFilters,
        initialState: {
            pagination: {
                pageIndex: current - 1,
                pageSize: pageSizeCore,
            },
            sorting: sorters.map((sorting) => ({
                id: sorting.field,
                desc: sorting.order === "desc",
            })),
            columnFilters: crudFiltersToColumnFilters({
                columns: rest.columns,
                crudFilters: filtersCore,
            }),
            ...reactTableInitialState,
        },
        pageCount,
        rowCount: data?.total || 0,
        manualPagination: true,
        manualSorting: isServerSideSortingEnabled,
        manualFiltering: isServerSideFilteringEnabled,
        state: {
            isLoading,
            columnFilters,
            showProgressBars: isRefetching,
            showAlertBanner: isError,
        },
        columnFilterDisplayMode: "popover",
        enableColumnFilterModes: true,
        enableGlobalFilter: false,
        layoutMode: "grid",
        muiFilterTextFieldProps: {
            sx: { m: "0.5rem 0", width: "100%" },
            variant: "outlined",
        },
        muiFilterDateTimePickerProps: {
            format: "YYYY-MM-DD HH:mm:ss",
        },
        muiLinearProgressProps: ({ isTopToolbar }) => ({
            color: "secondary",
            variant: "query",
            sx: {
                display: isTopToolbar ? "block" : "none", //hide bottom progress bar
            },
        }),
        ...rest,
    });

    const { state } = reactTableResult.options;
    const { pagination, sorting, columnFilterFns } = state;
    const { pageIndex, pageSize } = pagination ?? {};

    useEffect(() => {
        if (pageIndex !== undefined) {
            setCurrent(pageIndex + 1);
        }
    }, [pageIndex]);

    useEffect(() => {
        if (pageSize !== undefined) {
            setPageSizeCore(pageSize);
        }
    }, [pageSize]);

    useEffect(() => {
        if (sorting !== undefined) {
            const newSorters: CrudSorting = sorting.map((sorting) => ({
                field: sorting.id,
                order: sorting.desc ? "desc" : "asc",
            }));

            if (!isEqual(sorters, newSorters)) {
                setSorters(newSorters);
            }

            if (sorting.length > 0 && isPaginationEnabled && !isFirstRender) {
                setCurrent(1);
            }
        }
    }, [sorting]);

    useEffect(() => {
        const crudFilters: CrudFilter[] = columnFiltersToCrudFilters({
            columnFilters,
            columnFilterFns,
        });

        crudFilters.push(
            ...getRemovedFilters({
                nextFilters: crudFilters,
                coreFilters: filtersCore,
            })
        );
        if (!isEqual(crudFilters, filtersCore)) {
            setFilters(crudFilters);
            console.log("setFilters", crudFilters);
        }
        if (crudFilters.length > 0 && isPaginationEnabled && !isFirstRender) {
            setCurrent(1);
        }
    }, [columnFilters, columnFilterFns]);

    return {
        ...reactTableResult,
        refineCore: useTableResult,
    };
}
