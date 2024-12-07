import Paper from "@/components/base/Paper";
import {getRecentArticlesMetadata} from "@/lib/article";
import L from "@/lib/links";
import clsx from "clsx";
import Link from "next/link";
import {getTranslations} from "next-intl/server";

interface AsideRecentArticlesProps {
    className?: string;
}

async function AsideRecentArticles({className}: AsideRecentArticlesProps) {
    const articles = await getRecentArticlesMetadata({limit: 8});
    const t = await getTranslations("AsideRecentArticles");

    return (
        <Paper className={clsx("p-4 text-sm", className)}>
            <p className="text-text-subnote">{t("title")}</p>
            <div className="px-1.5 pt-2 divide-y divide-dashed divide-bg-tag">
                {articles.map(article => (
                    <Link key={article.slug}
                          className="block p-3 text-text-content hover:text-link-hover hover:underline"
                          href={L.post(article.slug)}>
                        {article.title}
                    </Link>
                ))}
            </div>
        </Paper>
    );
}

export default AsideRecentArticles;
