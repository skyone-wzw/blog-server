import ArticleEditor from "@/components/article-editor/ArticleEditor";
import {Article} from "@/lib/article";
import {getDynamicConfig} from "@/lib/config";

export async function generateMetadata() {
    const dynamicConfig = await getDynamicConfig();
    return {
        title: `新建文章 - ${dynamicConfig.site.title}`,
        description: dynamicConfig.site.description,
    }
}

function NewEditorPage() {
    const date = new Date();
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

    return <ArticleEditor article={article} className="hidden lg:flex w-0"/>;
}

export default NewEditorPage;
