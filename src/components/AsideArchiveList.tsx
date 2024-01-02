import Paper from "@/components/base/Paper";
import {getAllYears} from "@/lib/article";
import clsx from "clsx";
import Link from "next/link";

interface AsideArchiveListProps {
    className?: string;
}

async function AsideArchiveList({className}: AsideArchiveListProps) {
    const years = await getAllYears();

    return (
        <Paper className={clsx("p-4 text-sm", className)}>
            <p className="mb-3 text-text-subnote">归档</p>
            {years.map(y => (
                <Link key={y.year} className="p-2 text-text-content flex justify-between hover:bg-bg-hover"
                      href={`/archive/${y.year}`}>
                    {y.year}
                    <span className="text-text-subnote bg-bg-tag rounded px-2">{y.count}</span>
                </Link>
            ))}
        </Paper>
    );
}

export default AsideArchiveList;
