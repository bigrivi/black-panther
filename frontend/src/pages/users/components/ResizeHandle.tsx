import { PanelResizeHandle } from "react-resizable-panels";

import styles from "./styles.module.css";

export default function ResizeHandle({
    className = "",
    id,
}: {
    className?: string;
    id?: string;
}) {
    return (
        <PanelResizeHandle
            className={[styles.ResizeHandle, className].join(" ")}
            id={id}
        >
            <svg
                className="OG5fOa_Icon AzW8qW_ResizeHandleThumb"
                viewBox="0 0 24 24"
                data-direction="horizontal"
            >
                <path
                    fill="currentColor"
                    d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2m-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2m0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2m6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2m0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2m0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2"
                ></path>
            </svg>
        </PanelResizeHandle>
    );
}
