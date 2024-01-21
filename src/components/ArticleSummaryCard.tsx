import Paper from "@/components/base/Paper";
import {ArticleMetadata} from "@/lib/article";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";

interface ArticleSummaryCardProps {
    className?: string;
    article: ArticleMetadata;
}

function formatDate(date: Date) {
    return date.toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

function ArticleSummaryCard({className, article}: ArticleSummaryCardProps) {
    return (
        <Paper className={clsx("text-text-content", className)}>
            <Link className="contents" href={`/post/${article.slug}`}>
                <Image
                    blurDataURL={`/_next/image?url=${encodeURIComponent(`/api/cover/${article.slug}`)}&w=8&q=75`}
                    placeholder="blur"
                    className="rounded-t-lg w-full min-[360px]:aspect-[1300/630] min-h-[176px] object-cover block"
                    src={`/api/cover/${article.slug}`} width={1300} height={630} alt="cover"/>
            </Link>
            <article className="p-6">
                <h2 className="mb-4 break-words font-normal">
                    <Link className="text-xl text-text-main" href={`/post/${article.slug}`}>{article.title}</Link>
                </h2>
                <section className="mb-4 text-sm 2xl:text-base text-text-content">
                    {article.description}
                </section>
                <div className="flex justify-between text-text-subnote text-sm">
                    <div>
                        <time>{formatDate(article.createdAt)}</time>
                        <span className="mx-1 after:content-['·']"></span>
                        <Link className="text-text-content hover:underline hover:text-link-hover"
                              href={`/series/${encodeURIComponent(article.series)}`}>
                            {article.series}
                        </Link>
                    </div>
                    <Link className="text-link-content hover:text-link-hover" href={`/post/${article.slug}`}>
                        继续阅读
                    </Link>
                </div>
            </article>
        </Paper>
    );
}

export default ArticleSummaryCard;
