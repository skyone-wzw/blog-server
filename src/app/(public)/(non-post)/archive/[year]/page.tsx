import ArticleSummaryCard from "@/components/ArticleSummaryCard";
import Paper from "@/components/base/Paper";
import config from "@/config";
import {getArticlesByYear} from "@/lib/article";
import {notFound} from "next/navigation";

interface YearArchivePageProps {
    params: {
        year: string;
    };
}

export const generateMetadata = ({params}: YearArchivePageProps) => {
    const year = parseInt(params.year);
    return {
        title: `归档: ${year} 年 - ${config.title}`,
        description: `${config.description}。${year} 年所有文章的归档。`,
    };
};

async function YearArchivePage({params}: YearArchivePageProps) {
    const {year} = params;
    if (isNaN(parseInt(year))) return notFound();
    const articles = await getArticlesByYear(parseInt(year));

    if (articles.length === 0) return notFound();

    return (
        <>
            <Paper className="p-6">
                <span className="text-text-content text-lg mr-3">{year} 年</span>
                <span className="text-text-subnote">共 {articles.length} 篇</span>
            </Paper>
            {articles.map((article) => (
                <ArticleSummaryCard article={article} key={article.slug}/>
            ))}
        </>
    );
}

export default YearArchivePage;
