"use client";

import Paper from "@/components/base/Paper";
import clsx from "clsx";
import {ReactNode} from "react";

interface AsideArticleTocProps {
    className?: string;
    toc: ReactNode;
}

// 很奇怪的现象, 当使用 RSC 且文章没有标题时, toc 是 Fragment
// 但当使用 "use client" 时, toc 是 null
function AsideArticleToc({className, toc}: AsideArticleTocProps) {
    if (!toc) return null;
    return (
        <Paper className={clsx("p-4 text-sm overflow-auto xc-scroll", className)}>
            <p className="mb-3 text-text-subnote">文章目录</p>
            <div className="p-1.5">
                {toc}
            </div>
        </Paper>
    )
}

export default AsideArticleToc;
