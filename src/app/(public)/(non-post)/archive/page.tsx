import Paper from "@/components/base/Paper";
import {ArticleMetadata, getAllArticlesMetadata} from "@/lib/article";
import Link from "next/link";

function formatDate(date: Date) {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function groupByYear(articles: ArticleMetadata[]) {
    const years = new Set(articles.map(article => article.createdAt.getFullYear().toString()));
    const grouped = new Map<string, ArticleMetadata[]>();
    years.forEach(year => {
        grouped.set(year, articles
            .filter(article => article.createdAt.getFullYear().toString() === year)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
    });
    return grouped;
}

async function ArchivePage() {
    const articles = await getAllArticlesMetadata();
    const grouped = groupByYear(articles);
    const years = Array.from(grouped.keys()).sort((a, b) => parseInt(b) - parseInt(a));

    return years.map(year => (
        <div key={year} id={`year-${year}`}>
            <Link className="mb-2 block hover:underline" href={`/archive/${year}`}>
                <span className="text-text-content text-xl mr-3">{year} 年</span>
                <span className="text-text-subnote">共 {grouped.get(year)!.length} 篇</span>
            </Link>
            <div className="space-y-4">
                {grouped.get(year)!.map((article) => (
                    <Paper key={year} className="p-4">
                        <p className="text-text-subnote text-sm">{formatDate(article.createdAt)}</p>
                        <Link key={article.slug} href={`/post/${article.slug}`}
                              className="block text-text-content hover:text-link-hover hover:underline">{article.title}</Link>
                    </Paper>
                ))}
            </div>
        </div>
    ));
}

export default ArchivePage;
