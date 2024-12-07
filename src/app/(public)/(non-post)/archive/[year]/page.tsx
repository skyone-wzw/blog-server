import ArticleSummaryCard from "@/components/ArticleSummaryCard";
import Paper from "@/components/base/Paper";
import FooterPagination from "@/components/FooterPagination";
import {DEFAULT_ARTICLE_PER_PAGE, getArticleCountByYear, getArticlesByYearPaginate} from "@/lib/article";
import {getDynamicConfig} from "@/lib/config";
import L from "@/lib/links";
import {notFound} from "next/navigation";
import {getTranslations} from "next-intl/server";

interface YearArchivePageProps {
    params: {
        year: string;
    };
}

export const generateMetadata = async ({params}: YearArchivePageProps) => {
    const year = parseInt((await params).year);
    const {site} = await getDynamicConfig();
    const t = await getTranslations("page.archive.metadata");
    return {
        title: t("title", {siteName: site.title, year}),
        description: t("description", {siteName: site.title, siteDescription: site.description, year, page: 1}),
    };
};

async function YearArchivePage({params}: YearArchivePageProps) {
    const {year: _year} = await params;
    if (isNaN(parseInt(_year))) return notFound();
    const year = parseInt(_year);
    const articles = await getArticlesByYearPaginate(year);
    const t = await getTranslations("page.archive");

    if (articles.length === 0) return notFound();

    const articlesCount = await getArticleCountByYear(year);
    const total = Math.ceil(articlesCount / DEFAULT_ARTICLE_PER_PAGE);

    return (
        <>
            <Paper className="p-6">
                <span className="text-text-content text-lg mr-3">{t("title", {year})}</span>
                <span className="text-text-subnote">{t("count", {count: articlesCount})}</span>
            </Paper>
            {articles.map((article) => (
                <ArticleSummaryCard article={article} key={article.slug}/>
            ))}
            <FooterPagination current={1} total={total} getLink={(page) => {
                if (total === 1) return L.archive(year);
                return L.archive(year, page);
            }}/>
        </>
    );
}

export default YearArchivePage;
