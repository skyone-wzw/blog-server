import AsideArchiveList from "@/components/AsideArchiveList";
import AsideArticleToc from "@/components/AsideArticleToc";
import AsideProfile from "@/components/AsideProfile";
import AsideRecentArticles from "@/components/AsideRecentArticles";
import AsideSeries from "@/components/AsideSeries";
import AsideTags from "@/components/AsideTags";
import {TitleHASTRender} from "@/components/markdown/HASTRender";
import {PreprocessArticleTitle} from "@/components/markdown/title-processor";
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

    const hast = await PreprocessArticleTitle(article);
    const toc = <TitleHASTRender ast={hast}/>;

    return (
        <>
            <AsideProfile className="mb-6"/>
            <div className="top-[24px] lg:top-[76px] md:sticky space-y-6">
                {hast.children.length > 0 &&
                    <AsideArticleToc toc={toc} className="hidden md:block max-h-[40vh] min-h-[200px]"/>}
                <AsideRecentArticles className="xl:hidden"/>
                <AsideArchiveList className="xl:hidden"/>
                <AsideSeries/>
                <AsideTags/>
            </div>
        </>
    );
}

export default PostLeftPage;
