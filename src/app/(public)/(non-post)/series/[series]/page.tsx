import ArticleSummaryCard from "@/components/ArticleSummaryCard";
import Paper from "@/components/base/Paper";
import {getArticlesBySeries} from "@/lib/article";
import {getDynamicConfig} from "@/lib/config";
import {notFound} from "next/navigation";
import {getTranslations} from "next-intl/server";

interface SeriesPageProps {
    params: {
        series: string;
    };
}

export const generateMetadata = async ({params}: SeriesPageProps) => {
    const series = decodeURIComponent((await params).series);
    const t = await getTranslations("page.series.metadata");
    const {site} = await getDynamicConfig();
    return {
        title: t("title", {series, siteName: site.title}),
        description: t("description", {series, siteName: site.title, siteDescription: site.description}),
    };
};

async function SeriesPage({params}: SeriesPageProps) {
    const series = decodeURIComponent((await params).series);
    const articles = await getArticlesBySeries(series);
    const t = await getTranslations("page.series");

    if (articles.length === 0) return notFound();

    return (
        <>
            <Paper className="p-6">
                <span className="text-text-content text-xl mr-3">{t("title", {series})}</span>
                <span className="text-text-subnote">{t("count", {count: articles.length})}</span>
            </Paper>
            {articles.map((article) => (
                <ArticleSummaryCard article={article} key={article.slug}/>
            ))}
        </>
    );
}

export default SeriesPage;
