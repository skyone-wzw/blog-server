import {getAllArticlesMetadata} from "@/lib/article";
import ArticleClassifier from "../ArticleClassifier";

async function ArticleEditorLeftAside() {
    const articles = await getAllArticlesMetadata();

    return <ArticleClassifier articles={articles} className="hidden lg:flex"/>;
}

export default ArticleEditorLeftAside;
