import Paper from "@/components/base/Paper";
import {getAllYears} from "@/lib/article";
import L from "@/lib/links";
import clsx from "clsx";
import Link from "next/link";
import {getTranslations} from "next-intl/server";

interface AsideArchiveListProps {
    className?: string;
}

async function AsideArchiveList({className}: AsideArchiveListProps) {
    const years = await getAllYears();
    const t = await getTranslations("AsideArchiveList");

    return (
        <Paper className={clsx("p-4 text-sm", className)}>
            <p className="mb-3 text-text-subnote">{t("title")}</p>
            {years.map(y => (
                <Link key={y.year} className="p-2 text-text-content flex justify-between hover:bg-bg-hover"
                      href={L.archive(y.year)}>
                    {y.year}
                    <span className="text-text-subnote bg-bg-tag rounded-sm px-2">{y.count}</span>
                </Link>
            ))}
        </Paper>
    );
}

export default AsideArchiveList;
