import ArticleEditor from "@/components/article-editor/ArticleEditor";
import {getAllTags, getArticleBySlug} from "@/lib/article";
import {getDynamicConfig} from "@/lib/config";
import {notFound} from "next/navigation";
import {getTranslations} from "next-intl/server";
import {Metadata} from "next";

interface ArticleEditorPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export const generateMetadata = async ({params: params}: ArticleEditorPageProps): Promise<Metadata> => {
    const {slug} = await params;
    const {site} = await getDynamicConfig();
    const article = await getArticleBySlug(slug);
    const t = await getTranslations("page.admin.editor.post.metadata");

    if (!article) return notFound();

    return {
        title: t("title", {siteName: site.title, title: article?.title}),
        description: t("description", {siteName: site.title, siteDescription: site.description, title: article?.title}),
    };
};

async function ArticleEditorPage({params: params}: ArticleEditorPageProps) {
    const {slug} = await params;
    const article = await getArticleBySlug(slug);
    const allTags = (await getAllTags()).map(tag => tag.tag);

    if (!article) return notFound();

    return <ArticleEditor article={article} allTags={allTags} className="flex" />;
}

export default ArticleEditorPage;
