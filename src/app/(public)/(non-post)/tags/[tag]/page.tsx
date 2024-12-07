import ArticleSummaryCard from "@/components/ArticleSummaryCard";
import Paper from "@/components/base/Paper";
import {getArticlesByTag} from "@/lib/article";
import {getDynamicConfig} from "@/lib/config";
import {notFound} from "next/navigation";
import {getTranslations} from "next-intl/server";

interface TagDetailPageProps {
    params: {
        tag: string;
    };
}

export const generateMetadata = async ({params}: TagDetailPageProps) => {
    const tag = decodeURIComponent((await params).tag);
    const {site} = await getDynamicConfig();
    const t = await getTranslations("page.tags.metadata");
    return {
        title: t("title", {siteName: site.title, tag}),
        description: t("description", {siteName: site.title, siteDescription: site.description, tag}),
    };
};

async function TagDetailPage({params}: TagDetailPageProps) {
    const tag = decodeURIComponent((await params).tag);
    const articles = await getArticlesByTag(tag);
    const t = await getTranslations("page.tags");

    if (articles.length === 0) return notFound();

    return (
        <>
            <Paper className="p-6">
                <span className="text-text-content text-xl mr-3">{t("title", {tag})}</span>
                <span className="text-text-subnote">{t("count", {count: articles.length})}</span>
            </Paper>
            {articles.map((article) => (
                <ArticleSummaryCard article={article} key={article.slug}/>
            ))}
        </>
    );
}

export default TagDetailPage;
