"use client";

import {getHeadingId} from "@/components/markdown/tools";
import Link from "next/link";
import {DetailedHTMLProps, HTMLAttributes, MouseEventHandler} from "react";

type HeadingLinkProps = DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;

const autoScroll = (targetId: string): MouseEventHandler<HTMLAnchorElement> => (e) => {
    e.preventDefault();
    const paddingTop = 8;
    const target = document.getElementById(targetId);
    if (target) {
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

function HeadingLink2({id, children}: HeadingLinkProps) {
    const targetId = id || getHeadingId(children);
    return (
        <Link className="block text-text-content" href={`#${targetId}`} onClick={autoScroll(targetId)}>
            <p className="p-1.5 hover:bg-bg-hover">{children}</p>
        </Link>
    );
}

function HeadingLink3({id, children}: HeadingLinkProps) {
    const targetId = id || getHeadingId(children);
    return (
        <Link className="block text-text-content" href={`#${targetId}`} onClick={autoScroll(targetId)}>
            <p className="pl-4 ml-2 p-1.5 border-solid border-l-4 border-l-border hover:bg-bg-hover">{children}</p>
        </Link>
    );
}

export {HeadingLink2, HeadingLink3};
