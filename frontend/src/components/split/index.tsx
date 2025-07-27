import classNames from "classnames";
import { FC, PropsWithChildren, useRef, useState } from "react";
import { createPortal } from "react-dom";
import RSplit from "react-split";

type SplitProps = {
    minSize?: number;
    storageKey?: string;
};

export const Split: FC<PropsWithChildren<SplitProps>> = ({
    children,
    minSize: minSizeProp = 300,
    storageKey = "split-sizes",
}) => {
    const initSizes = localStorage.getItem(storageKey)
        ? localStorage
              .getItem(storageKey)!
              .split(",")
              .map((item) => Number(item))
        : [25, 75];
    const gutterContainer = useRef<HTMLElement>(document.createElement("div"));
    const [sizes, setSizes] = useState(initSizes);
    const prevSizesRef = useRef(initSizes[0] == 0 ? [25, 75] : initSizes);
    const [minSize, setMinSize] = useState(initSizes[0] == 0 ? 0 : minSizeProp);
    const [collapsed, setCollapsed] = useState(
        initSizes[0] == 0 ? true : false
    );
    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
        if (!collapsed) {
            prevSizesRef.current = sizes;
            setSizes([0, 100]);
            setMinSize(0);
            localStorage.setItem(storageKey, "0,100");
        } else {
            setMinSize(minSizeProp);
            setSizes(prevSizesRef.current);
            localStorage.setItem(storageKey, prevSizesRef.current.join(","));
        }
    };
    return (
        <>
            <RSplit
                className="split"
                expandToMin
                sizes={sizes}
                minSize={minSize}
                snapOffset={30}
                gutter={(index, direction) => {
                    gutterContainer.current.className = `gutter gutter-${direction}`;
                    return gutterContainer.current;
                }}
                onDragEnd={(sizes: number[]) => {
                    if (!collapsed) {
                        setSizes(sizes);
                        localStorage.setItem(storageKey, sizes.join(","));
                    }
                }}
            >
                {children}
            </RSplit>
            {createPortal(
                <div
                    onClick={toggleCollapsed}
                    className={classNames("gutter-btn", {
                        ["collapsed"]: collapsed,
                    })}
                ></div>,
                gutterContainer.current
            )}
        </>
    );
};
