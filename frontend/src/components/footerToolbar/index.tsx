import type { FC, PropsWithChildren } from "react";
import { useStyles } from "./styled";

type Props = {};

export const FooterToolbar: FC<PropsWithChildren<Props>> = ({ children }) => {
    const { styles } = useStyles();
    return <div className={styles.root}>{children}</div>;
};
