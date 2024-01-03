import AsideArchiveList from "@/components/AsideArchiveList";
import AsideProfile from "@/components/AsideProfile";
import AsideRecentArticles from "@/components/AsideRecentArticles";
import AsideSeries from "@/components/AsideSeries";
import AsideTags from "@/components/AsideTags";
import Paper from "@/components/base/Paper";
import {getArticleBySlug} from "@/lib/article";
import ParseArticleTitle from "@/components/markdown/ParseArticleTitle";

interface PostLeftPageProps {
    params: {
        slug: string;
    }
}

async function PostLeftPage({params}: PostLeftPageProps) {
    const slug = decodeURIComponent(params.slug);
    const article = await getArticleBySlug(slug);

    if (!article) return null;

    const toc = await ParseArticleTitle(article.content)

    return (
        <>
            <AsideProfile className="mb-6"/>
            <div className="top-[124px] lg:top-[76px] md:sticky space-y-6">
                <Paper className="hidden md:block p-4 text-sm max-h-[40vh] min-h-[200px] overflow-auto xc-scroll">
                    <p className="mb-3 text-text-subnote">文章目录</p>
                    <div className="p-1.5">
                        {toc}
                    </div>
                </Paper>
                <AsideRecentArticles className="xl:hidden"/>
                <AsideArchiveList className="xl:hidden"/>
                <AsideSeries/>
                <AsideTags/>
            </div>
        </>
    );
}

export default PostLeftPage;
