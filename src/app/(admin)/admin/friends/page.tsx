import Paper from "@/components/base/Paper";
import {getAvatarElement} from "@/components/FriendCard";
import {getDynamicConfig} from "@/lib/config";
import {getAllFriends, toClientFriend} from "@/lib/friends";
import {FriendLinkCreator, FriendLinkEditor} from "./FriendLinkEditor";
import {getTranslations} from "next-intl/server";

export async function generateMetadata() {
    const {site} = await getDynamicConfig();
    const t = await getTranslations("page.admin.friend.metadata");
    return {
        title: t("title", {siteName: site.title}),
        description: t("description", {siteName: site.title, siteDescription: site.description}),
    };
}

async function AdminFriendsPage() {
    const friends = await getAllFriends();
    const t = await getTranslations("page.admin.friend");

    return (
        <div className="mb-6 col-start-2 col-span-full space-y-6">
            <FriendLinkCreator/>
            {friends.length > 0 && (
                <>
                    <Paper className="p-6">
                        <span className="text-text-content text-lg mr-3">{t("clickToEdit")}</span>
                        <span className="text-text-subnote">{t("count", {count: friends.length})}</span>
                        {t.rich("label", {
                            p: (chunks) => <p className="text-sm text-text-subnote">{chunks}</p>,
                        })}
                    </Paper>
                    <div className="grid grid-cols-2 flex-wrap gap-4 @container">
                        {friends.map((friend) => (
                            <FriendLinkEditor
                                key={friend.id} friend={friend} avatarElement={getAvatarElement(toClientFriend(friend))}
                                className="col-span-full @[640px]:col-span-1"/>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default AdminFriendsPage;
