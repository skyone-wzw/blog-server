import ArticleClassifier from "../ArticleClassifier";
import {getAllArticlesMetadata} from "@/lib/article";

async function ArticleEditorLeftAside() {
    const articles = await getAllArticlesMetadata();

    return <ArticleClassifier articles={articles} className="hidden lg:flex"/>
}

export default ArticleEditorLeftAside;
