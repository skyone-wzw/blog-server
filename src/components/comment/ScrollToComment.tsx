"use client";

import {HTMLAttributes, MouseEventHandler, ReactNode, useMemo} from "react";
import Link from "next/link";

const autoScroll = (targetId: string): MouseEventHandler<HTMLAnchorElement> => (e) => {
    const paddingTop = 8;
    const target = document.getElementById(targetId);
    if (target) {
        e.preventDefault();
        let scrollY;
        if (window.matchMedia("(min-width: 1024px)").matches) {
            const header = document.getElementById("app-header");
            if (header) {
                scrollY = target.offsetTop - header.offsetHeight - paddingTop;
            }
        }
        if (!scrollY) {
            scrollY = target.offsetTop - paddingTop;
        }
        window.scrollTo({top: scrollY, behavior: "smooth"});
    }
};

interface ScrollToCommentProps extends HTMLAttributes<HTMLAnchorElement> {
    target: string;
    children: ReactNode;
}

function ScrollToComment({target, children, className, ...other}: ScrollToCommentProps) {
    const handleClick = useMemo(() => autoScroll(target), [target]);

    return (
        <Link onClick={handleClick} href={`#${target}`} className={className} {...other}>
            {children}
        </Link>
    );
}

export default ScrollToComment;
