import Paper from "@/components/base/Paper";
import config from "@/config";
import {ArticleMetadata, getAllArticlesMetadata} from "@/lib/article";
import Link from "next/link";

export const metadata = {
    title: `全部标签 - ${config.title}`,
    description: `${config.description}。所有标签汇总。`,
}

function formatDate(date: Date) {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function groupByTag(articles: ArticleMetadata[]) {
    const grouped = new Map<string, ArticleMetadata[]>();

    for (const article of articles) {
        for (const tag of article.tags) {
            if (!grouped.has(tag)) {
                grouped.set(tag, []);
            }

            grouped.get(tag)!.push(article);
        }
    }

    return grouped;
}

async function TagsPage() {
    const allArticles = await getAllArticlesMetadata();
    const grouped = groupByTag(allArticles);
    const tags = Array.from(grouped.keys()).sort();

    return tags.map(tag => (
        <div key={tag} id={`tag-${tag}`}>
            <Link className="mb-2 block hover:underline" href={`/tags/${tag}`}>
                <span className="text-text-content text-xl mr-3">标签：{tag}</span>
                <span className="text-text-subnote">共 {grouped.get(tag)!.length} 篇</span>
            </Link>
            <div className="space-y-4">
                {grouped.get(tag)!.map((article) => (
                    <Paper key={tag} className="p-4">
                        <p className="text-text-subnote text-sm">{formatDate(article.createdAt)}</p>
                        <Link key={article.slug} href={`/post/${article.slug}`}
                              className="block text-text-content hover:text-link-hover hover:underline">{article.title}</Link>
                    </Paper>
                ))}
            </div>
        </div>
    ));
}

export default TagsPage;
