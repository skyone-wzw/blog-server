import Paper from "@/components/base/Paper";
import {ArticleMetadata, getAllArticlesMetadata} from "@/lib/article";
import {getDynamicConfig} from "@/lib/config";
import L from "@/lib/links";
import Link from "next/link";
import {getFormatter, getTranslations} from "next-intl/server";

export async function generateMetadata() {
    const {site} = await getDynamicConfig();
    const t = await getTranslations("page.series.metadata-all");
    return {
        title: t("title", {siteName: site.title}),
        description: t("description", {siteName: site.title, siteDescription: site.description}),
    };
}

function groupBySeries(articles: ArticleMetadata[]) {
    const grouped = new Map<string, ArticleMetadata[]>();

    for (const article of articles) {
        if (!grouped.has(article.series)) {
            grouped.set(article.series, []);
        }

        grouped.get(article.series)!.push(article);
    }

    return grouped;
}

async function SeriesPage() {
    const articles = await getAllArticlesMetadata();
    const t = await getTranslations("page.series");
    const formatter = await getFormatter();
    const grouped = groupBySeries(articles);
    // 根据文章数量排序
    const series = Array.from(grouped.keys())
        .sort((a, b) => grouped.get(b)!.length - grouped.get(a)!.length);

    return series.map(series => (
        <div key={series} id={`series-${series}`}>
            <Link className="mb-2 block hover:underline" href={L.series(series)}>
                <span className="text-text-content text-xl mr-3">{t("title", {series})}</span>
                <span className="text-text-subnote">{t("count", {count: grouped.get(series)!.length})}</span>
            </Link>
            <div className="space-y-4">
                {grouped.get(series)!.map((article) => (
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

export default SeriesPage;
