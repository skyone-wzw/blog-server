import Paper from "@/components/base/Paper";
import {ArticleMetadata, getAllArticlesMetadata} from "@/lib/article";
import {getDynamicConfig} from "@/lib/config";
import L from "@/lib/links";
import Link from "next/link";
import {getFormatter, getTranslations} from "next-intl/server";

export async function generateMetadata() {
    const {site} = await getDynamicConfig();
    const t = await getTranslations("page.archive.metadata-all");
    return {
        title: t("title", {siteName: site.title}),
        description: t("description", {siteName: site.title, siteDescription: site.description}),
    };
}

function groupByYear(articles: ArticleMetadata[]) {
    const grouped = new Map<string, ArticleMetadata[]>();

    for (const article of articles) {
        const year = article.createdAt.getFullYear().toString();

        if (!grouped.has(year)) {
            grouped.set(year, []);
        }

        grouped.get(year)!.push(article);
    }

    return grouped;
}

async function ArchivePage() {
    const articles = await getAllArticlesMetadata();
    const t = await getTranslations("page.archive");
    const formatter = await getFormatter();
    const grouped = groupByYear(articles);
    const years = Array.from(grouped.keys()).sort((a, b) => parseInt(b) - parseInt(a));

    return years.map(year => (
        <div key={year} id={`year-${year}`}>
            <Link className="mb-2 block hover:underline" href={L.archive(year)}>
                <span className="text-text-content text-xl mr-3">{t("title", {year})}</span>
                <span className="text-text-subnote">{t("count", {count: grouped.get(year)!.length})}</span>
            </Link>
            <div className="space-y-4">
                {grouped.get(year)!.map((article) => (
                    <Paper key={article.slug} className="p-4">
                        <p className="text-text-subnote text-sm">{formatter.dateTime(article.createdAt, "default")}</p>
                        <Link key={article.slug} href={L.post(article.slug)}
                              className="block text-text-content hover:text-link-hover hover:underline">{article.title}</Link>
                    </Paper>
                ))}
            </div>
        </div>
    ));
}

export default ArchivePage;
