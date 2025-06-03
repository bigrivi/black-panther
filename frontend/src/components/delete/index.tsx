import {
    useDelete,
    useMutationMode,
    useResourceParams,
    useTranslate,
    useWarnAboutChange,
} from "@refinedev/core";
import {
    RefineButtonClassNames,
    RefineDeleteButtonProps,
} from "@refinedev/ui-types";
import React from "react";

import type { ButtonProps } from "@mui/material/Button";
import Button from "@mui/material/Button";
import type { SvgIconProps } from "@mui/material/SvgIcon";

import { useButtonCanAccess } from "@/hooks";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import { ConfirmDialog } from "../confirm-dialog";

export type DeleteButtonProps = RefineDeleteButtonProps<
    ButtonProps,
    {
        svgIconProps?: SvgIconProps;
        confirmMessage?: string;
        getRecordItemIds?: () => Array<string | number>;
    }
>;

export const DeleteButton: React.FC<DeleteButtonProps> = ({
    resource: resourceNameFromProps,
    resourceNameOrRouteName,
    recordItemId,
    onSuccess,
    mutationMode: mutationModeProp,
    children,
    successNotification,
    errorNotification,
    hideText,
    accessControl,
    meta,
    metaData,
    dataProviderName,
    confirmMessage,
    confirmOkText,
    confirmCancelText,
    svgIconProps,
    invalidates,
    getRecordItemIds,
    ...rest
}) => {
    const [open, setOpen] = React.useState(false);
    // const {
    //     onConfirm,
    //     title,
    //     label,
    //     hidden,
    //     disabled,
    //     loading,
    //     confirmTitle: defaultConfirmTitle,
    //     confirmOkLabel,
    //     cancelLabel,
    // } = useDeleteButton({
    //     resource: resourceNameFromProps ?? resourceNameOrRouteName,
    //     id: recordItemId,
    //     dataProviderName,
    //     mutationMode,
    //     accessControl,
    //     invalidates,
    //     onSuccess: (res) => {
    //         onSuccess && onSuccess(res);
    //         setOpen(false);
    //     },
    //     meta,
    //     successNotification,
    //     errorNotification,
    // });

    const { mutate, isLoading } = useDelete();
    const { setWarnWhen } = useWarnAboutChange();
    const { mutationMode } = useMutationMode(mutationModeProp);
    const { sx, disabled: disabledProp, ...restProps } = rest;
    const translate = useTranslate();
    const label = translate("buttons.delete", "Delete");

    const { resource, identifier } = useResourceParams({
        resource: resourceNameFromProps ?? resourceNameOrRouteName,
        id: recordItemId,
    });

    const { title, hidden, disabled } = useButtonCanAccess({
        action: "delete",
        accessControl: accessControl,
        id: recordItemId,
        resource,
    });
    const isHidden = hidden || rest.hidden;
    const isDisabled = disabled || disabledProp;

    if (isHidden) return null;

    const onConfirm = () => {
        let id = recordItemId;
        if (getRecordItemIds) {
            id = getRecordItemIds().join(",");
        }
        if (id && identifier) {
            setWarnWhen(false);
            mutate(
                {
                    id,
                    resource: identifier,
                    mutationMode,
                    successNotification: successNotification,
                    errorNotification: errorNotification,
                    meta: meta,
                    metaData: meta,
                    dataProviderName: dataProviderName,
                    invalidates: invalidates,
                },
                {
                    onSuccess: (res) => {
                        onSuccess && onSuccess(res);
                        setOpen(false);
                    },
                }
            );
        }
    };

    return (
        <>
            <Button
                color="error"
                onClick={() => setOpen(true)}
                loading={isLoading}
                startIcon={!hideText && <DeleteOutline {...svgIconProps} />}
                sx={{ minWidth: 0, ...sx }}
                loadingPosition={hideText ? "center" : "start"}
                className={RefineButtonClassNames.DeleteButton}
                {...restProps}
                disabled={isDisabled}
                title={title}
            >
                {hideText ? (
                    <DeleteOutline fontSize="small" {...svgIconProps} />
                ) : (
                    children ?? label
                )}
            </Button>
            <ConfirmDialog
                autoClose={false}
                loading={isLoading}
                message={
                    confirmMessage ??
                    translate("buttons.confirm", "Are you sure?")
                }
                onConfirm={onConfirm}
                open={open}
                onClose={() => {
                    setOpen(false);
                }}
            ></ConfirmDialog>
        </>
    );
};
