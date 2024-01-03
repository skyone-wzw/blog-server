import ArticleFloatingButton from "@/components/ArticleFloatingButton";
import ArticleFooterInfo from "@/components/ArticleFooterInfo";
import Paper from "@/components/base/Paper";
import config from "@/config";
import {getArticleBySlug} from "@/lib/article";
import MarkdownRender from "@/components/markdown/MarkdownRender";
import ParseArticleTitle from "@/components/markdown/ParseArticleTitle";
import Image from "next/image";
import Link from "next/link";
import {notFound} from "next/navigation";

interface PostPageProps {
    params: {
        slug: string;
    };
}

export async function generateMetadata({params}: PostPageProps) {
    const slug = decodeURI(params.slug);
    const article = await getArticleBySlug(slug);

    if (!article) return {};

    return {
        metadataBase: new URL(config.url),
        title: `${article.title} - ${config.title}`,
        description: article.description,
        keywords: article.tags,
        alternates: {
            canonical: `/post/${slug}`,
        },
        category: article.series,
        openGraph: {
            type: "article",
            title: `${article.title} - ${config.title}`,
            description: article.description,
            publishedTime: article.createdAt.toISOString(),
            modifiedTime: article.updatedAt.toISOString(),
            tags: article.tags,
            authors: [
                new URL(`${config.url}/about`),
            ],
            emails: config.master.email ? [config.master.email] : undefined,
            siteName: config.title,
            locale: "zh_CN",
            url: `/post/${slug}`,
            images: [
                {
                    url: `/_next/image?url=${encodeURIComponent(`/api/cover/${slug}`)}&w=1920&q=75`,
                    width: 1300,
                    height: 630,
                    alt: "cover",
                },
            ],
        },
    };
}

async function PostPage({params}: PostPageProps) {
    const slug = decodeURI(params.slug);
    const article = await getArticleBySlug(slug);

    if (!article) return notFound();

    const toc = await ParseArticleTitle(article.content)

    return (
        <Paper className="space-y-3 md:space-y-4">
            <Image className="w-full aspect-[130/63] rounded-t-lg" src={`/api/cover/${slug}`} alt="cover"
                   width={1300} height={630} priority/>
            <h1 className="px-4 md:px-6 text-2xl font-semibold text-text-main">{article.title}</h1>
            <div className="px-4 md:px-6 text-sm text-text-subnote flex flex-row flex-nowrap">
                <time>{article.createdAt.toLocaleDateString("zh-CN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                })}</time>
                <span className="mx-1 after:content-['·']"></span>
                <Link className="hover:text-link-hover" href={`/series/${article.series}`}>{article.series}</Link>
            </div>
            <div className="px-4 md:px-6 text-sm 2xl:text-base">{await MarkdownRender(article.content)}</div>
            <ArticleFooterInfo article={article}/>
            <ArticleFloatingButton toc={toc}/>
        </Paper>
    );
}

export default PostPage;
