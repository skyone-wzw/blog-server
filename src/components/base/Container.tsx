import clsx from "clsx";
import {ElementType, forwardRef, ReactNode, Ref} from "react";

interface ContainerProps {
    className?: string;
    component?: ElementType;
    children: ReactNode;
}

const Container = forwardRef(
    function Container({className, component, children}: ContainerProps, ref: Ref<HTMLElement>) {
        const Component = component || "div";
        return (
            <Component ref={ref}
                       className={clsx("block max-w-(--breakpoint-lg) px-3 mx-auto xl:max-w-[1200px] 2xl:max-w-[1400px] 3xl:max-w-[1750px]", className)}>
                {children}
            </Component>
        );
    },
);

export default Container;
