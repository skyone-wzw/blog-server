import AsideArchiveList from "@/components/AsideArchiveList";
import AsideArticleToc from "@/components/AsideArticleToc";
import AsideProfile from "@/components/AsideProfile";
import AsideRecentArticles from "@/components/AsideRecentArticles";
import AsideSeries from "@/components/AsideSeries";
import AsideTags from "@/components/AsideTags";
import {TitleHASTRender} from "@/components/markdown/HASTRender";
import {PreprocessArticleTitle} from "@/components/markdown/title-processor";
import {getCustomPageBySlug} from "@/lib/custom-page";

interface CustomLeftPageProps {
    params: {
        paths: string[];
    };
}

async function CustomLeftPage({params}: CustomLeftPageProps) {
    const paths = (await params).paths.map(decodeURIComponent);
    const slug = "/" + paths.join("/");
    const customPage = await getCustomPageBySlug(slug);

    if (!customPage) return null;

    const hast = await PreprocessArticleTitle(customPage);
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

export default CustomLeftPage;
