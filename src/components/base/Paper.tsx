import clsx from "clsx";
import {ElementType, forwardRef, MouseEventHandler, ReactNode, Ref} from "react";

interface BoxProps {
    onClick?: MouseEventHandler;
    className?: string;
    component?: ElementType;
    children: ReactNode;
}

const Paper = forwardRef(function Paper({className, onClick, component, children}: BoxProps, ref: Ref<HTMLElement>) {
    const Component = component || "div";

    return (
        <Component className={clsx("bg-bg-light rounded-lg shadow", className)} onClick={onClick} ref={ref}>
            {children}
        </Component>
    );
});

export default Paper;
