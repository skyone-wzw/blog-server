import Paper from "@/components/base/Paper";
import clsx from "clsx";
import {ReactNode} from "react";
import {getTranslations} from "next-intl/server";

interface AsideArticleTocProps {
    className?: string;
    toc: ReactNode;
}

async function AsideArticleToc({className, toc}: AsideArticleTocProps) {
    const t = await getTranslations("AsideArticleToc");
    if (!toc) return null;
    return (
        <Paper className={clsx("p-4 text-sm overflow-auto xc-scroll", className)}>
            <p className="mb-3 text-text-subnote">{t("title")}</p>
            <div className="p-1.5">
                {toc}
            </div>
        </Paper>
    );
}

export default AsideArticleToc;
