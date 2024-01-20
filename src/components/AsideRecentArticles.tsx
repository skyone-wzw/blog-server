import Paper from "@/components/base/Paper";
import {getRecentArticlesMetadata} from "@/lib/article";
import clsx from "clsx";
import Link from "next/link";

interface AsideRecentArticlesProps {
    className?: string;
}

async function AsideRecentArticles({className}: AsideRecentArticlesProps) {
    const articles = await getRecentArticlesMetadata({limit: 8});
    return (
        <Paper className={clsx("p-4 text-sm", className)}>
            <p className="text-text-subnote">最近文章</p>
            <div className="px-1.5 pt-2 divide-y divide-dashed divide-bg-tag">
                {articles.map(article => (
                    <Link key={article.slug}
                          className="block p-3 text-text-content hover:text-link-hover hover:underline"
                          href={`/post/${article.slug}`}>
                        {article.title}
                    </Link>
                ))}
            </div>
        </Paper>
    );
}

export default AsideRecentArticles;
