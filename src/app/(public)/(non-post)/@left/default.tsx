import AsideArchiveList from "@/components/AsideArchiveList";
import AsideProfile from "@/components/AsideProfile";
import AsideRecentArticles from "@/components/AsideRecentArticles";
import AsideSeries from "@/components/AsideSeries";
import AsideTags from "@/components/AsideTags";

async function NonPostLeftPage() {
    return (
        <>
            <AsideProfile className="mb-6"/>
            <div className="top-[124px] lg:top-[76px] md:sticky space-y-6">
                <AsideRecentArticles className="xl:hidden"/>
                <AsideArchiveList className="xl:hidden"/>
                <AsideSeries/>
                <AsideTags/>
            </div>
        </>
    );
}

export default NonPostLeftPage;
