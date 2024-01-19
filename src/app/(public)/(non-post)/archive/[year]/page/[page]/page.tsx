import ArticleSummaryCard from "@/components/ArticleSummaryCard";
import Paper from "@/components/base/Paper";
import FooterPagination from "@/components/FooterPagination";
import config from "@/config";
import {DEFAULT_ARTICLE_PER_PAGE, getArticleCountByYear, getArticlesByYearPaginate} from "@/lib/article";
import {notFound} from "next/navigation";

interface ArchivePaginationPageProps {
    params: {
        year: string;
        page: string;
    };
}

export const generateMetadata = ({params}: ArchivePaginationPageProps) => {
    const year = parseInt(params.year);
    return {
        title: `归档: ${year} 年 - ${config.title}`,
        description: `${config.description}。${year} 年所有文章的归档。第 ${params.page} 页。`,
    };
};

async function ArchivePaginationPage({params}: ArchivePaginationPageProps) {
    const {year: _year, page: _page} = params;
    if (isNaN(parseInt(_year))) return notFound();
    if (isNaN(parseInt(_page))) return notFound();
    const year = parseInt(_year);
    const page = parseInt(_page);
    const articles = await getArticlesByYearPaginate(year, {page});

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
            <FooterPagination current={page} total={total} getLink={(page) => {
                if (total === 1) return `/archive/${year}`;
                return `/archive/${year}/page/${page}`;
            }}/>
        </>
    )
}

export default ArchivePaginationPage;
