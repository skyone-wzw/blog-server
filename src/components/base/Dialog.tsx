"use client";

import clsx from "clsx";
import {ReactNode, useEffect, useRef} from "react";

interface DialogProps {
    className?: string;
    boxClassName?: string;
    center?: boolean;
    open: boolean;
    onClose?: () => void;
    clickInsideClose?: boolean;
    clickOutsideClose?: boolean;
    children: ReactNode;
    blur?: boolean;
}

function Dialog({className, boxClassName, center, open, onClose, clickInsideClose, clickOutsideClose, blur, children}: DialogProps) {
    const ref = useRef<HTMLDialogElement>(null);
    const rootRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ref.current) {
            if (open) {
                ref.current.showModal();
            } else {
                ref.current.close();
            }
        }
    }, [open]);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (clickInsideClose && rootRef.current === e.target) {
                onClose?.();
                return;
            }
            if (clickOutsideClose && !rootRef.current!.contains(e.target as Node) && document.body.contains(e.target as Node)) {
                onClose?.();
                return;
            }
        };
        if (open) {
            window.addEventListener("click", handleClick);
            return () => {
                window.removeEventListener("click", handleClick);
            };
        }
    }, [clickInsideClose, clickOutsideClose, onClose, open]);

    return (
        <dialog
            ref={ref}
            className={clsx("backdrop:bg-[#00000033] bg-transparent overflow-visible", {
                "backdrop:backdrop-blur-xs": blur,
            }, className)}>
            <div className={clsx({"w-screen h-screen flex justify-center items-center": center}, boxClassName)}>
                <div className="contents" ref={rootRef}>
                    {children}
                </div>
            </div>
        </dialog>
    );
}

export default Dialog;
