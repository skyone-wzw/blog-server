import {ArticleMetadata} from "@/lib/article";
import L from "@/lib/links";
import clsx from "clsx";
import Link from "next/link";

interface ArticleFooterInfoProps {
    className?: string;
    article: ArticleMetadata;
}

function ArticleFooterInfo({className, article}: ArticleFooterInfoProps) {
    return (
        <div className={clsx("flex flex-row flex-wrap p-4 md:p-6 text-sm text-text-subnote gap-2", className)}>
            <Link
                className="py-1 px-2 text-text-content border-text-content hover:text-bg-light hover:bg-text-content border-solid border-[1px] rounded-full tag-prefix"
                href={L.series(article.series)}>
                {article.series}
            </Link>
            {article.tags.map(tag => (
                <Link key={tag}
                      className="py-1 px-2 border-text-subnote hover:text-text-content hover:bg-bg-hover border-solid border-[1px] rounded-full tag-prefix"
                      href={L.tags(tag)}>
                    {tag}
                </Link>
            ))}
        </div>
    );
}

export default ArticleFooterInfo;
