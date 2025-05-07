import React, {
    FC,
    useState,
    Fragment,
    PropsWithChildren,
    useEffect,
} from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
} from "@mui/material";
import { NotListedLocation } from "@mui/icons-material";

interface IButtonStyle {
    variant?: "text" | "outlined" | "contained";
    color?: "inherit" | "primary" | "secondary" | "default";
}

interface ConfirmButtonProps {
    buttonText?: string;
    buttonStyle?: IButtonStyle;
    disabled?: boolean;
    message?: string;
    onConfirm: (event?: any, param?: any) => void | Promise<any>;
    onShow?: (event?: any, param?: any) => void;
}

const defaultButtonStyle = {
    color: "secondary",
    variant: "outlined",
};

export const ConfirmButton: FC<PropsWithChildren<ConfirmButtonProps>> = ({
    buttonText,
    buttonStyle,
    message = "Are you sure?",
    onConfirm,
    onShow,
    children,
    disabled = false,
}) => {
    buttonStyle = { ...(defaultButtonStyle as any), ...buttonStyle };
    const [dialogVisible, setDialogVisible] = useState(false);
    const [requesting, setRequesting] = useState(false);

    const handleCancel = (evt) => {
        setDialogVisible(false);
        evt.preventDefault();
        evt.stopPropagation();
    };
    const handleConfirm = async (evt) => {
        evt.preventDefault();
        evt.stopPropagation();
        const isAsync = onConfirm.constructor.name === "AsyncFunction";
        if (isAsync) {
            setRequesting(true);
            try {
                await onConfirm();
                setRequesting(false);
                setDialogVisible(false);
            } catch (e) {
                setRequesting(false);
            }
        } else {
            onConfirm();
            setDialogVisible(false);
        }
    };

    const handleButtonClick = (evt) => {
        if (disabled) {
            return;
        }
        setDialogVisible(true);
        evt.preventDefault();
        evt.stopPropagation();
    };

    useEffect(() => {
        if (dialogVisible) {
            onShow && onShow();
        }
    }, [dialogVisible]);

    const hasChildren = !!children;
    return (
        <Fragment>
            {!hasChildren && (
                <Button onClick={handleButtonClick} {...buttonStyle}>
                    {buttonText}
                </Button>
            )}
            {hasChildren &&
                React.cloneElement(children as any, {
                    onClick: handleButtonClick,
                })}
            <Dialog open={dialogVisible}>
                <DialogTitle>
                    <Stack direction="row" alignItems="center">
                        <NotListedLocation />
                        Delete Confirmation
                    </Stack>
                </DialogTitle>
                <DialogContent dividers>
                    <div style={{ width: 250 }}>
                        <h4>{message}</h4>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel}>No</Button>
                    <Button
                        color="primary"
                        variant="contained"
                        loading={requesting}
                        disabled={requesting}
                        onClick={handleConfirm}
                    >
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
};
