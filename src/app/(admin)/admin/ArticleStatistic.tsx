import Paper from "@/components/base/Paper";
import {getAllArticleCount, getAllSeries, getAllTags, getArticleTextSum} from "@/lib/article";
import clsx from "clsx";

interface ArticleStatisticProps {
    className?: string;
}

async function ArticleStatistic({className}: ArticleStatisticProps) {
    const total = await getAllArticleCount();
    const series = await getAllSeries();
    const tags = await getAllTags();
    const totalText = await getArticleTextSum();

    return (
        <Paper className={clsx("p-4", className)}>
            <h2 className="mb-2 text-text-subnote">创作统计</h2>
            <div className="divide-y divide-bg-tag border-y border-bg-tag">
                <div className="flex justify-start items-center flex-row p-2 gap-y-2">
                    <span className="basis-28 flex-grow">文章</span>
                    <span className="flex-shrink-0">{total} 篇</span>
                </div>
                <div className="flex justify-start items-center flex-row p-2 gap-y-2">
                    <span className="basis-28 flex-grow">总字数</span>
                    <span
                        className="flex-shrink-0">{totalText.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} 字</span>
                </div>
                <div className="flex justify-start items-center flex-row p-2 gap-y-2">
                    <span className="basis-28 flex-grow">系列</span>
                    <span className="flex-shrink-0">{series.length} 个</span>
                </div>
                <div className="flex justify-start items-center flex-row p-2 gap-y-2">
                    <span className="basis-28 flex-grow">标签</span>
                    <span className="flex-shrink-0">{tags.length} 个</span>
                </div>
            </div>
        </Paper>
    );
}

export default ArticleStatistic;
