import { confirmable, ConfirmDialog as RConfirmDialog } from "react-confirm";
import { ConfirmDialog } from "../dialog";

export interface Props {
    okLabel?: string;
    cancelLabel?: string;
    title?: string;
    confirmation?: string;
}

const Confirmation: RConfirmDialog<Props, boolean> = ({
    show,
    proceed,
    title,
    confirmation,
}) => {
    const onConfirm = () => {
        proceed(true);
    };
    return (
        <ConfirmDialog
            autoClose={false}
            title={title}
            message={confirmation}
            onConfirm={onConfirm}
            open={show}
            onClose={() => {
                proceed(false);
            }}
        ></ConfirmDialog>
    );
};

export default confirmable(Confirmation);
