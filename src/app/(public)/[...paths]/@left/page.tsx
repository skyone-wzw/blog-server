import AsideArchiveList from "@/components/AsideArchiveList";
import AsideArticleToc from "@/components/AsideArticleToc";
import AsideProfile from "@/components/AsideProfile";
import AsideRecentArticles from "@/components/AsideRecentArticles";
import AsideSeries from "@/components/AsideSeries";
import AsideTags from "@/components/AsideTags";
import ParseArticleTitle from "@/components/markdown/ParseArticleTitle";
import {getCustomPageBySlug} from "@/lib/custom-page";

interface CustomLeftPageProps {
    params: {
        paths: string[];
    };
}

async function CustomLeftPage({params}: CustomLeftPageProps) {
    const paths = params.paths.map(decodeURIComponent);
    const slug = "/" + paths.join("/");
    const customPage = await getCustomPageBySlug(slug);

    if (!customPage) return null;

    const toc = await ParseArticleTitle(customPage);

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

export default CustomLeftPage;
