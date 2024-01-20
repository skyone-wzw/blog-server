import clsx from "clsx";
import {ReactNode, useEffect, useRef} from "react";

interface DialogProps {
    className?: string;
    open: boolean;
    onClose?: () => void;
    clickOutsideClose?: boolean;
    children: ReactNode;
    blur?: boolean;
}

function Dialog({className, open, onClose, clickOutsideClose, blur, children}: DialogProps) {
    const ref = useRef<HTMLDialogElement>(null);

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
            if (clickOutsideClose || ref.current === e.target) {
                onClose?.();
            }
        };
        if (open) {
            window.addEventListener("click", handleClick);
            return () => {
                window.removeEventListener("click", handleClick);
            };
        }
    }, [clickOutsideClose, onClose, open]);

    return (
        <dialog
            ref={ref}
            className={clsx("backdrop:bg-[#00000033] bg-transparent", {
                "backdrop:backdrop-blur-sm": blur,
            }, className)}>
            {children}
        </dialog>
    );
}

export default Dialog;
