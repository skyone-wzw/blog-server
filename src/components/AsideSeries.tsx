import Paper from "@/components/base/Paper";
import {getAllSeries} from "@/lib/article";
import L from "@/lib/links";
import clsx from "clsx";
import Link from "next/link";
import {getTranslations} from "next-intl/server";

interface AsideSeriesProps {
    className?: string;
}

async function AsideSeries({className}: AsideSeriesProps) {
    const series = await getAllSeries();
    const t = await getTranslations("AsideSeries");

    return (
        <Paper className={clsx("p-4 text-sm", className)}>
            <p className="mb-3 text-text-subnote">{t("title")}</p>
            {series.map(s => (
                <Link key={s.series} className="p-2 text-text-content flex justify-between hover:bg-bg-hover"
                      href={L.series(s.series)}>
                    {s.series}
                    <span className="text-text-subnote bg-bg-tag rounded px-2">{s.count}</span>
                </Link>
            ))}
        </Paper>
    );
}

export default AsideSeries;
