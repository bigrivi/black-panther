import React, {
    FC,
    useState,
    Fragment,
    PropsWithChildren,
    useEffect,
    SyntheticEvent,
} from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import WarningIcon from "@mui/icons-material/Warning";

interface ConfirmDialogProps {
    title?: string;
    message?: string;
    open: boolean;
    onConfirm: (event?: any, param?: any) => void | Promise<any>;
    onClose?: () => void;
}

export const ConfirmDialog: FC<PropsWithChildren<ConfirmDialogProps>> = ({
    title = "Delete Confirmation",
    message = "Are you sure?",
    onConfirm,
    children,
    open,
    onClose,
}) => {
    const [requesting, setRequesting] = useState(false);

    const handleCancel = (evt: SyntheticEvent) => {
        onClose && onClose();
        evt.preventDefault();
        evt.stopPropagation();
    };
    const handleConfirm = async (evt: SyntheticEvent) => {
        evt.preventDefault();
        evt.stopPropagation();
        const isAsync = onConfirm.constructor.name === "AsyncFunction";
        if (isAsync) {
            setRequesting(true);
            try {
                await onConfirm();
                setRequesting(false);
                onClose && onClose();
            } catch (e) {
                setRequesting(false);
            }
        } else {
            onConfirm();
            onClose && onClose();
        }
    };

    return (
        <Dialog open={open}>
            <DialogTitle>
                <Stack direction="row" gap={1} alignItems="center">
                    <WarningIcon color="warning" />
                    {title}
                </Stack>
            </DialogTitle>
            <IconButton
                aria-label="close"
                onClick={handleCancel}
                sx={(theme) => ({
                    position: "absolute",
                    right: 8,
                    top: 8,
                    color: theme.palette.grey[500],
                })}
            >
                <CloseIcon />
            </IconButton>
            <DialogContent dividers>
                <div>{message}</div>
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
    );
};
