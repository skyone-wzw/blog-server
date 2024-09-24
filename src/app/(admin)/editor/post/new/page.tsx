import ArticleEditor from "@/components/article-editor/ArticleEditor";
import {Article, getAllTags} from "@/lib/article";
import {getDynamicConfig} from "@/lib/config";

export async function generateMetadata() {
    const dynamicConfig = await getDynamicConfig();
    return {
        title: `新建文章 - ${dynamicConfig.site.title}`,
        description: dynamicConfig.site.description,
    };
}

async function ArticleEditorPage() {
    const date = new Date();
    const allTags = (await getAllTags()).map(tag => tag.tag);
    const article: Article = {
        id: "",
        title: `untitled-${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
        slug: "",
        description: "",
        series: "未分类",
        tags: [],
        published: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        content: "",
    };

    return <ArticleEditor article={article} allTags={allTags} className="hidden lg:flex w-0"/>;
}

export default ArticleEditorPage;
