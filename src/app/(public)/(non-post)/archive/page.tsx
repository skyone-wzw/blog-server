import Paper from "@/components/base/Paper";
import config from "@/config";
import {ArticleMetadata, getAllArticlesMetadata} from "@/lib/article";
import L from "@/lib/links";
import Link from "next/link";

export const metadata = {
    title: `归档 - ${config.title}`,
    description: `${config.description}。所有文章的归档。`,
};

function formatDate(date: Date) {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
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
    const grouped = groupByYear(articles);
    const years = Array.from(grouped.keys()).sort((a, b) => parseInt(b) - parseInt(a));

    return years.map(year => (
        <div key={year} id={`year-${year}`}>
            <Link className="mb-2 block hover:underline" href={L.archive(year)}>
                <span className="text-text-content text-xl mr-3">{year} 年</span>
                <span className="text-text-subnote">共 {grouped.get(year)!.length} 篇</span>
            </Link>
            <div className="space-y-4">
                {grouped.get(year)!.map((article) => (
                    <Paper key={year} className="p-4">
                        <p className="text-text-subnote text-sm">{formatDate(article.createdAt)}</p>
                        <Link key={article.slug} href={L.post(article.slug)}
                              className="block text-text-content hover:text-link-hover hover:underline">{article.title}</Link>
                    </Paper>
                ))}
            </div>
        </div>
    ));
}

export default ArchivePage;
