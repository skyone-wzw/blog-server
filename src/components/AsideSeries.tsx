import Paper from "@/components/base/Paper";
import {getAllSeries} from "@/lib/article";
import clsx from "clsx";
import Link from "next/link";

interface AsideSeriesProps {
    className?: string;
}

async function AsideSeries({className}: AsideSeriesProps) {
    const series = await getAllSeries();

    return (
        <Paper className={clsx("p-4 text-sm", className)}>
            <p className="mb-3 text-text-subnote">合集</p>
            {series.map(s => (
                <Link key={s.series} className="p-2 text-text-content flex justify-between hover:bg-bg-hover"
                      href={`/series/${encodeURIComponent(s.series)}`}>
                    {s.series}
                    <span className="text-text-subnote bg-bg-tag rounded px-2">{s.count}</span>
                </Link>
            ))}
        </Paper>
    );
}

export default AsideSeries;
