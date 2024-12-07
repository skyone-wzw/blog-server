import ArticleFloatingButton from "@/components/ArticleFloatingButton";
import Paper from "@/components/base/Paper";
import {HASTRender, TitleHASTRender} from "@/components/markdown/HASTRender";
import {PreprocessArticleContent} from "@/components/markdown/server-content-processor";
import {PreprocessArticleTitle} from "@/components/markdown/title-processor";
import {getDynamicConfig} from "@/lib/config";
import {getCustomPageBySlug} from "@/lib/custom-page";
import L from "@/lib/links";
import {Metadata} from "next";
import Link from "next/link";
import {notFound} from "next/navigation";
import {getLocale, getTranslations} from "next-intl/server";

interface CustomPageProps {
    params: {
        paths: string[];
    };
}

export async function generateMetadata({params}: CustomPageProps): Promise<Metadata> {
    const paths = (await params).paths.map(decodeURIComponent);
    const slug = "/" + paths.join("/");
    const customPage = await getCustomPageBySlug(slug);
    const locale = await getLocale();

    if (!customPage) return {};

    const dynamicConfig = await getDynamicConfig();

    return {
        metadataBase: new URL(dynamicConfig.site.url),
        title: `${customPage.title} - ${dynamicConfig.site.title}`,
        description: customPage.description,
        alternates: {
            canonical: L.custom(customPage.slug),
        },
        openGraph: {
            type: "article",
            title: `${customPage.title} - ${dynamicConfig.site.title}`,
            description: customPage.description,
            publishedTime: customPage.createdAt.toISOString(),
            modifiedTime: customPage.updatedAt.toISOString(),
            authors: [
                new URL(dynamicConfig.site.url),
            ],
            emails: dynamicConfig.profile.email ? [dynamicConfig.profile.email] : undefined,
            siteName: dynamicConfig.site.title,
            locale: locale,
            url: L.custom(customPage.slug),
        },
    };
}

async function CustomPage({params}: CustomPageProps) {
    const paths = (await params).paths.map(decodeURIComponent);
    const slug = "/" + paths.join("/");
    const customPage = await getCustomPageBySlug(slug);
    const t = await getTranslations("page.custom-page")

    if (!customPage) return notFound();

    const tocHast = await PreprocessArticleTitle(customPage);
    const toc = <TitleHASTRender ast={tocHast}/>;
    const content = <HASTRender ast={await PreprocessArticleContent(customPage)}/>;

    return (
        <Paper className="py-6 space-y-3 md:space-y-4">
            <h1 className="px-4 md:px-6 text-2xl font-semibold text-text-main">{customPage.title}</h1>
            <div className="px-4 md:px-6 text-sm text-text-subnote flex flex-row flex-nowrap justify-between">
                <div>
                    <time>{customPage.createdAt.toLocaleDateString("zh-CN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}</time>
                </div>
                <Link className="hover:text-link-hover" href={L.editor.custom(customPage.slug)}>{t("edit")}</Link>
            </div>
            <div className="px-4 md:px-6 text-sm 2xl:text-base">{content}</div>
            <ArticleFloatingButton toc={tocHast.children.length > 0 && toc}/>
        </Paper>
    );
}

export default CustomPage;
