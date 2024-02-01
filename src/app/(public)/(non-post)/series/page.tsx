import Paper from "@/components/base/Paper";
import config from "@/config";
import {ArticleMetadata, getAllArticlesMetadata} from "@/lib/article";
import L from "@/lib/links";
import Link from "next/link";

export const metadata = {
    title: `全部分类 - ${config.title}`,
    description: `${config.description}。所有文章分类。`,
};

function formatDate(date: Date) {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
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
    const grouped = groupBySeries(articles);
    // 根据文章数量排序
    const series = Array.from(grouped.keys())
        .sort((a, b) => grouped.get(b)!.length - grouped.get(a)!.length);

    return series.map(series => (
        <div key={series} id={`series-${series}`}>
            <Link className="mb-2 block hover:underline" href={L.series(series)}>
                <span className="text-text-content text-xl mr-3">分类：{series}</span>
                <span className="text-text-subnote">共 {grouped.get(series)!.length} 篇</span>
            </Link>
            <div className="space-y-4">
                {grouped.get(series)!.map((article) => (
                    <Paper key={series} className="p-4">
                        <p className="text-text-subnote text-sm">{formatDate(article.createdAt)}</p>
                        <Link key={article.slug} href={L.post(article.slug)}
                              className="block text-text-content hover:text-link-hover hover:underline">{article.title}</Link>
                    </Paper>
                ))}
            </div>
        </div>
    ));
}

export default SeriesPage;
