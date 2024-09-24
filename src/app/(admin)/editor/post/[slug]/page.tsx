import ArticleEditor from "@/components/article-editor/ArticleEditor";
import {getAllTags, getArticleBySlug} from "@/lib/article";
import {getDynamicConfig} from "@/lib/config";
import {notFound} from "next/navigation";

interface ArticleEditorPageProps {
    params: {
        slug: string;
    };
}

export const generateMetadata = async ({params: {slug}}: ArticleEditorPageProps) => {
    const dynamicConfig = await getDynamicConfig();
    const article = await getArticleBySlug(slug);

    return {
        title: `编辑: ${article?.title} - ${dynamicConfig.site.title}`,
        description: dynamicConfig.site.description,
    };
};

async function ArticleEditorPage({params: {slug}}: ArticleEditorPageProps) {
    const article = await getArticleBySlug(slug);
    const allTags = (await getAllTags()).map(tag => tag.tag);

    if (!article) return notFound();

    return <ArticleEditor article={article} allTags={allTags} className="flex"/>;
}

export default ArticleEditorPage;
