import clsx from "clsx";
import {CSSProperties, ElementType, forwardRef, MouseEventHandler, ReactNode, Ref} from "react";

interface PaperProps {
    style?: CSSProperties;
    onClick?: MouseEventHandler;
    className?: string;
    component?: ElementType;
    children: ReactNode;
}

const Paper = forwardRef(function Paper({style, className, onClick, component, children}: PaperProps, ref: Ref<HTMLElement>) {
    const Component = component || "div";

    return (
        <Component className={clsx("bg-bg-light rounded-lg shadow", className)} style={style} onClick={onClick} ref={ref}>
            {children}
        </Component>
    );
});

export default Paper;
