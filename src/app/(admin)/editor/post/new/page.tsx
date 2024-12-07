import ArticleEditor from "@/components/article-editor/ArticleEditor";
import {Article, getAllTags} from "@/lib/article";
import {getDynamicConfig} from "@/lib/config";
import {getTranslations} from "next-intl/server";

export async function generateMetadata() {
    const {site} = await getDynamicConfig();
    const t = await getTranslations("page.admin.editor.post.metadata-new");
    return {
        title: t("title", {siteName: site.title}),
        description: t("description", {siteName: site.title, siteDescription: site.description}),
    };
}

async function ArticleEditorPage() {
    const allTags = (await getAllTags()).map(tag => tag.tag);
    const t = await getTranslations("page.admin.editor.post");
    const article: Article = {
        id: "",
        title: t("default.title"),
        slug: "",
        description: "",
        series: t("default.series"),
        tags: [],
        published: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        content: "",
    };

    return <ArticleEditor article={article} allTags={allTags} className="hidden lg:flex w-0"/>;
}

export default ArticleEditorPage;
