import { useDeleteButton } from "@refinedev/core";
import {
    RefineButtonClassNames,
    RefineDeleteButtonProps,
} from "@refinedev/ui-types";
import React from "react";

import type { ButtonProps } from "@mui/material/Button";
import Button from "@mui/material/Button";
import type { SvgIconProps } from "@mui/material/SvgIcon";

import DeleteOutline from "@mui/icons-material/DeleteOutline";
import { ConfirmDialog } from "../confirm-dialog";

export type DeleteButtonProps = RefineDeleteButtonProps<
    ButtonProps,
    {
        /**
         * SVG icon props for the delete button
         */
        svgIconProps?: SvgIconProps;
        confirmMessage?: string;
    }
>;

export const DeleteButton: React.FC<DeleteButtonProps> = ({
    resource: resourceNameFromProps,
    resourceNameOrRouteName,
    recordItemId,
    onSuccess,
    mutationMode,
    children,
    successNotification,
    errorNotification,
    hideText = true,
    accessControl,
    meta,
    metaData,
    dataProviderName,
    confirmMessage,
    confirmOkText,
    confirmCancelText,
    svgIconProps,
    invalidates,
    ...rest
}) => {
    const [open, setOpen] = React.useState(false);
    const {
        onConfirm,
        title,
        label,
        hidden,
        disabled,
        loading,
        confirmTitle: defaultConfirmTitle,
        confirmOkLabel,
        cancelLabel,
    } = useDeleteButton({
        resource: resourceNameFromProps ?? resourceNameOrRouteName,
        id: recordItemId,
        dataProviderName,
        mutationMode,
        accessControl,
        invalidates,
        onSuccess: (res) => {
            onSuccess && onSuccess(res);
            setOpen(false);
        },
        meta,
        successNotification,
        errorNotification,
    });

    const { sx, ...restProps } = rest;

    const isDisabled = disabled || rest.disabled;
    const isHidden = hidden || rest.hidden;

    if (isHidden) return null;

    return (
        <div>
            <Button
                color="error"
                onClick={() => setOpen(true)}
                disabled={isDisabled}
                loading={loading}
                startIcon={!hideText && <DeleteOutline {...svgIconProps} />}
                title={title}
                sx={{ minWidth: 0, ...sx }}
                loadingPosition={hideText ? "center" : "start"}
                className={RefineButtonClassNames.DeleteButton}
                {...restProps}
            >
                {hideText ? (
                    <DeleteOutline fontSize="small" {...svgIconProps} />
                ) : (
                    children ?? label
                )}
            </Button>
            <ConfirmDialog
                autoClose={false}
                loading={loading}
                message={confirmMessage ?? defaultConfirmTitle}
                onConfirm={onConfirm}
                open={open}
                onClose={() => {
                    setOpen(false);
                }}
            ></ConfirmDialog>
        </div>
    );
};
