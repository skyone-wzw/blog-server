import AsideArchiveList from "@/components/AsideArchiveList";
import AsideRecentArticles from "@/components/AsideRecentArticles";

function PostRightPage() {
    return (
        <div className="top-[24px] lg:top-[76px] md:sticky space-y-6">
            <AsideArchiveList/>
            <AsideRecentArticles/>
        </div>
    );
}

export default PostRightPage;
