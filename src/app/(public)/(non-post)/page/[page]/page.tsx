import ArticleSummaryCard from "@/components/ArticleSummaryCard";
import MainPagePagination from "@/components/MainPagePagination";
import {DEFAULT_ARTICLE_PER_PAGE, getAllArticleCount, getRecentArticles} from "@/lib/article";
import {notFound} from "next/navigation";

interface PaginationPageProps {
    params: {
        page: string;
    }
}

async function PaginationPage({params}: PaginationPageProps) {
    const {page: _page} = params;
    if (isNaN(parseInt(_page))) return notFound();
    const page = parseInt(_page);
    const articles = await getRecentArticles({page, limit: DEFAULT_ARTICLE_PER_PAGE});

    if (articles.length === 0) return notFound();

    const articlesCount = await getAllArticleCount();
    const total = Math.ceil(articlesCount / DEFAULT_ARTICLE_PER_PAGE);

    return (
        <>
            {articles.map((article) => (
                <ArticleSummaryCard article={article} key={article.slug}/>
            ))}
            <MainPagePagination current={page} total={total}/>
        </>
    );
}

export default PaginationPage;