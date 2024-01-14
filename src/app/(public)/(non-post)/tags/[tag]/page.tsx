import ArticleSummaryCard from "@/components/ArticleSummaryCard";
import Paper from "@/components/base/Paper";
import config from "@/config";
import {getArticlesByTag} from "@/lib/article";
import {notFound} from "next/navigation";

interface TagDetailPageProps {
    params: {
        tag: string;
    };
}

export const generateMetadata = ({params}: TagDetailPageProps) => {
    const tag = decodeURIComponent(params.tag);
    return {
        title: `标签: ${tag} - ${config.title}`,
        description: `${config.description}。包含 ${tag} 标签的所有文章。`,
    };
};

async function TagDetailPage({params}: TagDetailPageProps) {
    const tag = decodeURIComponent(params.tag);
    const articles = await getArticlesByTag(tag);

    if (articles.length === 0) return notFound();

    return (
        <>
            <Paper className="p-6">
                <span className="text-text-content text-xl mr-3">标签：{tag}</span>
                <span className="text-text-subnote">共 {articles.length} 篇</span>
            </Paper>
            {articles.map((article) => (
                <ArticleSummaryCard article={article} key={article.slug}/>
            ))}
        </>
    );
}

export default TagDetailPage;
