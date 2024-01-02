import clsx from "clsx";
import {ElementType, forwardRef, ReactNode, Ref} from "react";

interface BoxProps {
    className?: string;
    component?: ElementType;
    children: ReactNode;
}

const Paper = forwardRef(function Paper({className, component, children}: BoxProps, ref: Ref<HTMLElement>) {
    const Component = component || "div";

    return (
        <Component className={clsx("bg-bg-light rounded-lg shadow", className)} ref={ref}>
            {children}
        </Component>
    );
});

export default Paper;
