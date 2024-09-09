import AsideArchiveList from "@/components/AsideArchiveList";
import AsideArticleToc from "@/components/AsideArticleToc";
import AsideProfile from "@/components/AsideProfile";
import AsideRecentArticles from "@/components/AsideRecentArticles";
import AsideSeries from "@/components/AsideSeries";
import AsideTags from "@/components/AsideTags";
import ParseArticleTitle from "@/components/markdown/ParseArticleTitle";
import {getArticleBySlug} from "@/lib/article";

interface PostLeftPageProps {
    params: {
        slug: string;
    };
}

async function PostLeftPage({params}: PostLeftPageProps) {
    const slug = decodeURIComponent(params.slug);
    const article = await getArticleBySlug(slug);

    if (!article) return null;

    const toc = await ParseArticleTitle(article);

    return (
        <>
            <AsideProfile className="mb-6"/>
            <div className="top-[24px] lg:top-[76px] md:sticky space-y-6">
                <AsideArticleToc toc={toc} className="hidden md:block max-h-[40vh] min-h-[200px]"/>
                <AsideRecentArticles className="xl:hidden"/>
                <AsideArchiveList className="xl:hidden"/>
                <AsideSeries/>
                <AsideTags/>
            </div>
        </>
    );
}

export default PostLeftPage;
