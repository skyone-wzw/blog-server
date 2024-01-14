import clsx from "clsx";
import {ElementType, ReactNode} from "react";

interface FlexProps {
    shrink?: boolean;
    grow?: boolean;
    wrap?: boolean;
    center?: boolean;
    className?: string;
    component?: ElementType;
    children: ReactNode;
}

function Flex({grow, shrink, wrap, center, className, component, children}: FlexProps) {
    const Component = component || "div";
    const classes = [];
    classes.push(grow ? "grow" : "grow-0");
    classes.push(shrink ? "shrink" : "shrink-0");
    classes.push(center ? "justify-center" : "justify-start");
    classes.push(wrap ? "flex-wrap" : "flex-nowrap");

    return (
        <Component className={clsx("flex items-stretch", classes, className)}>
            {children}
        </Component>
    );
}

export default Flex;
