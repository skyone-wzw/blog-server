import ArticleSummaryCard from "@/components/ArticleSummaryCard";
import MainPagePagination from "@/components/MainPagePagination";
import {DEFAULT_ARTICLE_PER_PAGE, getAllArticleCount, getRecentArticles} from "@/lib/article";

async function HomePage() {
    const articlesCount = await getAllArticleCount();
    const total = Math.ceil(articlesCount / DEFAULT_ARTICLE_PER_PAGE);
    const articles = await getRecentArticles({page: 1, limit: DEFAULT_ARTICLE_PER_PAGE});

    return (
        <>
            {articles.map((article) => (
                <ArticleSummaryCard article={article} key={article.slug}/>
            ))}
            <MainPagePagination current={1} total={total}/>
        </>
    );
}

export default HomePage;
