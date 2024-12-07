import Paper from "@/components/base/Paper";
import {getAllArticleCount, getAllSeries, getAllTags, getArticleTextSum} from "@/lib/article";
import clsx from "clsx";
import {getTranslations} from "next-intl/server";

interface ArticleStatisticProps {
    className?: string;
}

async function ArticleStatistic({className}: ArticleStatisticProps) {
    const total = await getAllArticleCount();
    const series = await getAllSeries();
    const tags = await getAllTags();
    const totalText = await getArticleTextSum();
    const t = await getTranslations("page.admin.home.ArticleStatistic");

    return (
        <Paper className={clsx("p-4", className)}>
            <h2 className="mb-2 text-text-subnote">{t("title")}</h2>
            <div className="divide-y divide-bg-tag border-y border-bg-tag">
                <div className="flex justify-start items-center flex-row p-2 gap-y-2">
                    <span className="basis-28 flex-grow">{t("article")}</span>
                    <span className="flex-shrink-0">{t("articleCount", {count: total})}</span>
                </div>
                <div className="flex justify-start items-center flex-row p-2 gap-y-2">
                    <span className="basis-28 flex-grow">{t("word")}</span>
                    <span className="flex-shrink-0">
                        {t("wordCount", {count: totalText.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")})}
                    </span>
                </div>
                <div className="flex justify-start items-center flex-row p-2 gap-y-2">
                    <span className="basis-28 flex-grow">{t("series")}</span>
                    <span className="flex-shrink-0">{t("seriesCount", {count: series.length})}</span>
                </div>
                <div className="flex justify-start items-center flex-row p-2 gap-y-2">
                    <span className="basis-28 flex-grow">{t("tag")}</span>
                    <span className="flex-shrink-0">{t("tagCount", {count: tags.length})}</span>
                </div>
            </div>
        </Paper>
    );
}

export default ArticleStatistic;
