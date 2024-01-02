import {getAllArticlesMetadata} from "@/lib/article";
import ArticleClassifier from "./ArticleClassifier";

async function EditorArticleSelector() {
    const articles = await getAllArticlesMetadata();

    return <ArticleClassifier articles={articles} className="flex debug"/>;
}

export default EditorArticleSelector;
