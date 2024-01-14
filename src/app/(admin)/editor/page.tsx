import ArticleEditor from "@/components/article-editor/ArticleEditor";
import config from "@/config";
import {Article} from "@/lib/article";

export const metadata = {
    title: `编辑文章 - ${config.title}`,
    description: config.description,
};

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
