import CloseIcon from "@mui/icons-material/Close";
import WarningIcon from "@mui/icons-material/Warning";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Stack,
} from "@mui/material";
import { FC, PropsWithChildren, SyntheticEvent, useState } from "react";

interface ConfirmDialogProps {
    loading?: boolean;
    title?: string;
    message?: string;
    open: boolean;
    onConfirm: (event?: any, param?: any) => void | Promise<any>;
    onClose?: () => void;
    autoClose?: boolean;
}

export const ConfirmDialog: FC<PropsWithChildren<ConfirmDialogProps>> = ({
    title = "Confirmation",
    message = "Are you sure?",
    onConfirm,
    open,
    onClose,
    loading,
    autoClose = true,
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
                if (autoClose) {
                    onClose && onClose();
                }
            } catch (e) {
                setRequesting(false);
            }
        } else {
            onConfirm();
            if (autoClose) {
                onClose && onClose();
            }
        }
    };

    return (
        <Dialog open={open} closeAfterTransition={false}>
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
                <div style={{ minWidth: 300 }}>{message}</div>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel}>No</Button>
                <Button
                    color="primary"
                    variant="contained"
                    loading={requesting || loading}
                    disabled={requesting || loading}
                    onClick={handleConfirm}
                >
                    Yes
                </Button>
            </DialogActions>
        </Dialog>
    );
};
