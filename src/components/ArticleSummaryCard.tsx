import Paper from "@/components/base/Paper";
import {ArticleMetadata} from "@/lib/article";
import {getDynamicConfig} from "@/lib/config";
import L from "@/lib/links";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import {getFormatter, getTranslations} from "next-intl/server";

interface ArticleSummaryCardProps {
    className?: string;
    article: ArticleMetadata;
}

async function ArticleSummaryCard({className, article}: ArticleSummaryCardProps) {
    const dynamicConfig = await getDynamicConfig();
    const t = await getTranslations("ArticleSummaryCard");
    const formatter = await getFormatter();

    return (
        <Paper className={clsx("text-text-content", className)}>
            <Link className="contents" href={L.post(article.slug)}>
                <Image
                    blurDataURL={L.cover(article.slug, article.updatedAt.getTime(), dynamicConfig.site.logo, true)}
                    placeholder="blur" width={1300} height={630} alt="cover"
                    className="rounded-t-lg w-full min-[360px]:aspect-1300/630 min-h-[176px] object-cover block"
                    src={L.cover(article.slug, article.updatedAt.getTime(), dynamicConfig.site.logo)}/>
            </Link>
            <article className="p-6">
                <h2 className="mb-4 break-words text-2xl font-semibold text-text-main">
                    <Link className="text-2xl text-text-main" href={L.post(article.slug)}>{article.title}</Link>
                </h2>
                <section className="mb-4 text-sm 2xl:text-base text-text-content">
                    {article.description}
                </section>
                <div className="flex justify-between text-text-subnote text-sm">
                    <div>
                        <time dateTime={article.createdAt.toISOString()}>
                            {formatter.dateTime(article.createdAt, "default")}
                        </time>
                        <span className="mx-1 after:content-['·']"></span>
                        <Link className="text-text-content hover:underline hover:text-link-hover"
                              href={L.series(article.series)}>
                            {article.series}
                        </Link>
                    </div>
                    <Link className="text-link-content hover:text-link-hover" href={L.post(article.slug)}>
                        {t("readMore")}
                    </Link>
                </div>
            </article>
        </Paper>
    );
}

export default ArticleSummaryCard;
