import clsx from "clsx";
import {MouseEventHandler, ReactNode, useRef} from "react";

interface DialogProps {
    className?: string;
    open: boolean;
    onClose?: () => void;
    clickInsideClose?: boolean;
    children: ReactNode;
}

function Dialog({className, open, onClose, clickInsideClose, children}: DialogProps) {
    const ref = useRef<HTMLDivElement>(null);

    const handleClick: MouseEventHandler<HTMLDivElement> = (e) => {
        if (clickInsideClose || ref.current === e.target) {
            onClose?.();
        }
    };

    return (
        <div
            ref={ref}
            className={clsx("fixed z-30 top-0 left-0 bottom-0 right-0 bg-[#00000066]", !open && "hidden", className)}
            onClick={handleClick}>
            {children}
        </div>
    );
}

export default Dialog;
