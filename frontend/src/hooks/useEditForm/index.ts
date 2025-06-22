import { confirm } from "@/utils/confirm";
import {
    BaseRecord,
    HttpError,
    useGetToPath,
    useGo,
    useTranslate,
    useWarnAboutChange,
} from "@refinedev/core";
import {
    useForm,
    UseFormProps,
    UseFormReturnType,
} from "@refinedev/react-hook-form";
import { FieldValues } from "react-hook-form";
import { useSearchParams } from "react-router";

export type UseEditFormReturnType<
    TQueryFnData extends BaseRecord = BaseRecord,
    TError extends HttpError = HttpError,
    TVariables extends FieldValues = FieldValues,
    TContext extends object = {},
    TData extends BaseRecord = TQueryFnData,
    TResponse extends BaseRecord = TData,
    TResponseError extends HttpError = TError
> = UseFormReturnType<
    TQueryFnData,
    TError,
    TVariables,
    TContext,
    TData,
    TResponse,
    TResponseError
> & {
    close: () => void;
};

type UseEditFormProps<
    TQueryFnData extends BaseRecord = BaseRecord,
    TError extends HttpError = HttpError,
    TVariables extends FieldValues = FieldValues,
    TContext extends object = {},
    TData extends BaseRecord = TQueryFnData,
    TResponse extends BaseRecord = TData,
    TResponseError extends HttpError = TError
> = UseFormProps<
    TQueryFnData,
    TError,
    TVariables,
    TContext,
    TData,
    TResponse,
    TResponseError
> & {
    action: "create" | "edit";
};

export const useEditForm = <
    TQueryFnData extends BaseRecord = BaseRecord,
    TError extends HttpError = HttpError,
    TVariables extends FieldValues = FieldValues,
    TContext extends object = {},
    TData extends BaseRecord = TQueryFnData,
    TResponse extends BaseRecord = TData,
    TResponseError extends HttpError = TError
>(
    {
        refineCoreProps,
        action,
        ...rest
    }: UseEditFormProps<
        TQueryFnData,
        TError,
        TVariables,
        TContext,
        TData,
        TResponse,
        TResponseError
    > = { action: "create" }
): UseEditFormReturnType<
    TQueryFnData,
    TError,
    TVariables,
    TContext,
    TData,
    TResponse,
    TResponseError
> => {
    const getToPath = useGetToPath();
    const t = useTranslate();
    const [searchParams] = useSearchParams();
    const go = useGo();
    const { warnWhen, setWarnWhen } = useWarnAboutChange();
    const useHookFormResult = useForm<
        TQueryFnData,
        TError,
        TVariables,
        TContext,
        TData,
        TResponse,
        TResponseError
    >({
        refineCoreProps: {
            action,
            redirect: "list",
            onMutationSuccess: () => {
                back();
            },
            ...refineCoreProps,
        },
        ...rest,
    });

    const back = () => {
        go({
            to:
                searchParams.get("to") ??
                getToPath({
                    action: "list",
                }) ??
                "",
            query: {
                to: undefined,
            },
            options: {
                keepQuery: true,
            },
            type: "replace",
        });
    };

    const onClose = async () => {
        if (warnWhen) {
            const warnWhenConfirm = await confirm({
                confirmation: t(
                    "warnWhenUnsavedChanges",
                    "Are you sure you want to leave? You have unsaved changes."
                ),
            });

            if (warnWhenConfirm) {
                setWarnWhen(false);
            } else {
                return;
            }
        }
        back();
    };

    return {
        close: onClose,
        ...useHookFormResult,
    };
};
