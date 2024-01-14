import clsx from "clsx";
import Link from "next/link";
import {forwardRef, ReactNode, Ref} from "react";

interface HeaderLinkProps {
    className?: string;
    title?: string;
    ariaLabel?: string;
    href: string;
    target?: "_blank" | "_self" | "_parent" | "_top";
    children: ReactNode;
}

const HeaderLink = forwardRef(function InternalHeaderLink({
                                                              className,
                                                              title,
                                                              href,
                                                              children,
                                                              target,
                                                              ariaLabel,
                                                          }: HeaderLinkProps, ref: Ref<HTMLAnchorElement>) {
    return (
        <Link href={href} title={title} ref={ref} target={target} aria-label={ariaLabel}
              className={clsx("py-3 px-2 sm:px-3 shrink-0 flex cursor-pointer items-center hover:bg-bg-hover text-text-content hover:text-link-hover", className)}>
            {children}
        </Link>
    );
});

export default HeaderLink;
