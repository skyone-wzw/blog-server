import ArticleEditor from "@/components/article-editor/ArticleEditor";
import {getArticleBySlug} from "@/lib/article";
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

    if (!article) return notFound();

    return <ArticleEditor article={article} className="flex"/>;
}

export default ArticleEditorPage;
