import { Button } from "@mui/material";
import { useModal } from "@refinedev/core";
import React, { FC, Fragment, PropsWithChildren } from "react";
import { ConfirmDialog } from "../confirm-dialog";

interface ConfirmButtonProps {
    title?: string;
    message?: string;
    onConfirm: (event?: any, param?: any) => void | Promise<any>;
    onClose?: () => void;
    buttonText?: string;
    disabled?: boolean;
}

export const ConfirmButton: FC<PropsWithChildren<ConfirmButtonProps>> = ({
    title = "Confirmation",
    message = "Are you sure?",
    onConfirm,
    children,
    disabled,
    buttonText,
}) => {
    const { show, close, visible } = useModal();
    const handleButtonClick = (evt) => {
        if (disabled) {
            return;
        }
        evt.preventDefault();
        evt.stopPropagation();
        show();
    };
    const hasChildren = !!children;
    return (
        <Fragment>
            {!hasChildren && (
                <Button data-testid="btn-confirm" onClick={handleButtonClick}>
                    {buttonText}
                </Button>
            )}
            {hasChildren &&
                React.cloneElement(children as any, {
                    onClick: handleButtonClick,
                })}

            <ConfirmDialog
                title={title}
                message={message}
                onConfirm={onConfirm}
                open={visible}
                onClose={() => {
                    close();
                }}
            ></ConfirmDialog>
        </Fragment>
    );
};
