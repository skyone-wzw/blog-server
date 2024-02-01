import ArticleSummaryCard from "@/components/ArticleSummaryCard";
import Paper from "@/components/base/Paper";
import FooterPagination from "@/components/FooterPagination";
import config from "@/config";
import {DEFAULT_ARTICLE_PER_PAGE, getArticleCountByYear, getArticlesByYearPaginate} from "@/lib/article";
import L from "@/lib/links";
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
    const {year: _year} = params;
    if (isNaN(parseInt(_year))) return notFound();
    const year = parseInt(_year);
    const articles = await getArticlesByYearPaginate(year);

    if (articles.length === 0) return notFound();

    const articlesCount = await getArticleCountByYear(year);
    const total = Math.ceil(articlesCount / DEFAULT_ARTICLE_PER_PAGE);

    return (
        <>
            <Paper className="p-6">
                <span className="text-text-content text-lg mr-3">{year} 年</span>
                <span className="text-text-subnote">共 {articlesCount} 篇</span>
            </Paper>
            {articles.map((article) => (
                <ArticleSummaryCard article={article} key={article.slug}/>
            ))}
            <FooterPagination current={1} total={total} getLink={(page) => {
                if (total === 1) return  L.archive(year);
                return L.archive(year, page);
            }}/>
        </>
    );
}

export default YearArchivePage;
