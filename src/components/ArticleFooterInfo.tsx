import {ArticleMetadata} from "@/lib/article";
import clsx from "clsx";
import Link from "next/link";

interface ArticleFooterInfoProps {
    className?: string;
    article: ArticleMetadata;
}

function ArticleFooterInfo({className, article}: ArticleFooterInfoProps) {
    return (
        <div className={clsx("flex flex-row p-4 md:p-6 text-sm text-text-subnote space-x-2", className)}>
            <Link className="py-1 px-2 text-text-content border-text-content hover:text-bg-light hover:bg-text-content border-solid border-[1px] rounded-full tag-prefix"
                  href={`/series/${encodeURIComponent(article.series)}`}>
                {article.series}
            </Link>
            {article.tags.map(tag => (
                <Link key={tag} className="py-1 px-2 border-text-subnote hover:text-text-content hover:bg-bg-hover border-solid border-[1px] rounded-full tag-prefix"
                      href={`/tags/${encodeURIComponent(tag)}`}>
                    {tag}
                </Link>
            ))}
        </div>
    )
}

export default ArticleFooterInfo;
