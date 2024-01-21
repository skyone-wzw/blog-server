import clsx from "clsx";
import {ReactNode, useEffect, useRef} from "react";

interface DialogProps {
    className?: string;
    open: boolean;
    onClose?: () => void;
    clickInsideClose?: boolean;
    clickOutsideClose?: boolean;
    children: ReactNode;
    blur?: boolean;
}

function Dialog({className, open, onClose, clickInsideClose, clickOutsideClose, blur, children}: DialogProps) {
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
            if (clickOutsideClose && !rootRef.current!.contains(e.target as Node)) {
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
            className={clsx("backdrop:bg-[#00000033] bg-transparent", {
                "backdrop:backdrop-blur-sm": blur,
            }, className)}>
            <div ref={rootRef}>{children}</div>
        </dialog>
    );
}

export default Dialog;
