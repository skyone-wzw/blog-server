import Paper from "@/components/base/Paper";
import {getAllSeries} from "@/lib/article";
import Link from "next/link";

async function SeriesPage() {
    const series = await getAllSeries();

    return (
        <Paper className="p-6">
            <h2 className="text-text-main text-xl mb-2">所有文章合集：</h2>
            <div className="space-y-2 p-2">
                {series.map(({series, count}) => (
                    <Link className="flex justify-between text-text-content hover:text-link-hover hover:underline"
                          key={series} id={`series-${series}`} href={`/series/${series}`}>
                        <span>{series}</span>
                        <span className="text-text-subnote">共 {count} 篇</span>
                    </Link>
                ))}
            </div>
        </Paper>
    );
}

export default SeriesPage;
