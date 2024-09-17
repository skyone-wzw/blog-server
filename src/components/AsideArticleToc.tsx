import Paper from "@/components/base/Paper";
import clsx from "clsx";
import {ReactNode} from "react";

interface AsideArticleTocProps {
    className?: string;
    toc: ReactNode;
}

function AsideArticleToc({className, toc}: AsideArticleTocProps) {
    if (!toc) return null;
    return (
        <Paper className={clsx("p-4 text-sm overflow-auto xc-scroll", className)}>
            <p className="mb-3 text-text-subnote">文章目录</p>
            <div className="p-1.5">
                {toc}
            </div>
        </Paper>
    );
}

export default AsideArticleToc;
