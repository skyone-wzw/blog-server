import ArticleFloatingButton from "@/components/ArticleFloatingButton";
import ArticleFooterAdjacentNavigation from "@/components/ArticleFooterAdjacentNavigation";
import ArticleFooterInfo from "@/components/ArticleFooterInfo";
import Paper from "@/components/base/Paper";
import {HASTRender, TitleHASTRender} from "@/components/markdown/HASTRender";
import {PreprocessArticleContent} from "@/components/markdown/server-content-processor";
import {PreprocessArticleTitle} from "@/components/markdown/title-processor";
import {getArticleBySlug} from "@/lib/article";
import {getDynamicConfig} from "@/lib/config";
import L from "@/lib/links";
import Image from "next/image";
import Link from "next/link";
import {notFound} from "next/navigation";
import CommentTree from "@/components/comment/CommentTree";
import {getCommentsByArticleId} from "@/lib/comment";
import {getFormatter, getLocale, getTranslations} from "next-intl/server";

interface PostPageProps {
    params: {
        slug: string;
    };
}

export async function generateMetadata({params}: PostPageProps) {
    const slug = decodeURIComponent((await params).slug);
    const locale = await getLocale();
    const article = await getArticleBySlug(slug);

    if (!article) return {};

    const dynamicConfig = await getDynamicConfig();

    return {
        metadataBase: new URL(dynamicConfig.site.url),
        title: `${article.title} - ${dynamicConfig.site.title}`,
        description: article.description,
        keywords: article.tags,
        alternates: {
            canonical: L.post(article.slug),
        },
        category: article.series,
        openGraph: {
            type: "article",
            title: `${article.title} - ${dynamicConfig.site.title}`,
            description: article.description,
            publishedTime: article.createdAt.toISOString(),
            modifiedTime: article.updatedAt.toISOString(),
            tags: article.tags,
            authors: [
                new URL(dynamicConfig.site.url),
            ],
            emails: dynamicConfig.profile.email ? [dynamicConfig.profile.email] : undefined,
            siteName: dynamicConfig.site.title,
            locale: locale,
            url: L.post(article.slug),
            images: [
                {
                    url: `${dynamicConfig.site.url}${L.cover(article.slug, article.updatedAt.getTime(), dynamicConfig.site.logo)}`,
                    width: 1300,
                    height: 630,
                    alt: "cover",
                },
            ],
        },
    };
}

async function PostPage({params}: PostPageProps) {
    const slug = decodeURIComponent((await params).slug);
    const article = await getArticleBySlug(slug);
    const {site, fediverse} = await getDynamicConfig();
    const t = await getTranslations("page.post");
    const formatter = await getFormatter();

    if (!article) return notFound();

    const comments = await getCommentsByArticleId(article.id);
    const tocHast = await PreprocessArticleTitle(article);
    const toc = <TitleHASTRender ast={tocHast}/>;
    const content = <HASTRender ast={await PreprocessArticleContent(article)}/>;

    return (
        <>
            <Paper className="space-y-3 md:space-y-4">
                <Image
                    blurDataURL={L.cover(article.slug, article.updatedAt.getTime(), site.logo, true)}
                    className="w-full aspect-[130/63] rounded-t-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                    src={L.cover(article.slug, article.updatedAt.getTime(), site.logo)}
                    alt="cover" width={1300} height={630} priority/>
                <h1 className="px-4 pt-2 md:px-6 text-2xl font-semibold text-text-main">{article.title}</h1>
                <div className="px-4 md:px-6 text-sm text-text-subnote flex flex-row flex-nowrap justify-between">
                    <div>
                        <time dateTime={article.createdAt.toISOString()}>
                            {formatter.dateTime(article.createdAt, "default")}
                        </time>
                        <span className="mx-1 after:content-['·']"></span>
                        <Link className="text-text-content hover:text-link-hover"
                              href={L.series(article.series)}>{article.series}</Link>
                    </div>
                    <Link className="hover:text-link-hover" href={L.editor.post(article.slug)}>{t("edit")}</Link>
                </div>
                <div className="px-4 md:px-6 text-sm 2xl:text-base">{content}</div>
                <ArticleFooterInfo article={article}/>
                <ArticleFloatingButton toc={tocHast.children.length > 0 && toc}/>
            </Paper>
            <ArticleFooterAdjacentNavigation slug={article.slug}/>
            {fediverse.enabled && <CommentTree articleSlug={article.slug} comments={comments}/>}
        </>
    );
}

export default PostPage;
