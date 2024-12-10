import CommentsManager from "@/app/(admin)/admin/comments/CommentsManager";
import {getAllArticlesTitle} from "@/lib/article";
import {getAllGuestsName} from "@/lib/comment";
import {getDynamicConfig} from "@/lib/config";

async function AdminCommentsPage() {
    const articles = await getAllArticlesTitle();
    const guests = await getAllGuestsName();
    const {options} = await getDynamicConfig();

    return (
        <CommentsManager articles={articles} guests={guests} fallbackAvatar={options.gravatar}/>
    );
}

export default AdminCommentsPage;
