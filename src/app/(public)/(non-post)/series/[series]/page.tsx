import ArticleSummaryCard from "@/components/ArticleSummaryCard";
import Paper from "@/components/base/Paper";
import {getArticlesBySeries} from "@/lib/article";
import {getDynamicConfig} from "@/lib/config";
import {notFound} from "next/navigation";

interface SeriesPageProps {
    params: {
        series: string;
    };
}

export const generateMetadata = async ({params}: SeriesPageProps) => {
    const series = decodeURIComponent((await params).series);
    const dynamicConfig = await getDynamicConfig();
    return {
        title: `分类: ${series} - ${dynamicConfig.site.title}`,
        description: `${dynamicConfig.site.description}。${series}系列文章。`,
    };
};

async function SeriesPage({params}: SeriesPageProps) {
    const series = decodeURIComponent((await params).series);
    const articles = await getArticlesBySeries(series);

    if (articles.length === 0) return notFound();

    return (
        <>
            <Paper className="p-6">
                <span className="text-text-content text-xl mr-3">合集：{series}</span>
                <span className="text-text-subnote">共 {articles.length} 篇</span>
            </Paper>
            {articles.map((article) => (
                <ArticleSummaryCard article={article} key={article.slug}/>
            ))}
        </>
    );
}

export default SeriesPage;
