import ArticleSummaryCard from "@/components/ArticleSummaryCard";
import FooterPagination from "@/components/FooterPagination";
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
            <FooterPagination current={1} total={total} getLink={(page) => {
                if (total === 1) return "/";
                return `/page/${page}`;
            }}/>
        </>
    );
}

export default HomePage;
