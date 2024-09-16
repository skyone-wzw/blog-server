import Paper from "@/components/base/Paper";
import {getAvatarElement} from "@/components/FriendCard";
import {getDynamicConfig} from "@/lib/config";
import {getAllFriends, toClientFriend} from "@/lib/friends";
import {FriendLinkCreator, FriendLinkEditor} from "./FriendLinkEditor";

export async function generateMetadata() {
    const dynamicConfig = await getDynamicConfig();
    return {
        title: `友链管理 - ${dynamicConfig.site.title}`,
        description: `${dynamicConfig.site.description}`,
    };
}

async function AdminFriendsPage() {
    const friends = await getAllFriends();

    return (
        <div className="mb-6 col-start-2 col-span-full space-y-6">
            <FriendLinkCreator/>
            {friends.length > 0 && (
                <>
                    <Paper className="p-6">
                        <span className="text-text-content text-lg mr-3">点击以修改友链</span>
                        <span className="text-text-subnote">共 {friends.length} 条</span>
                        <p className="text-sm text-text-subnote">快和朋友们交换友链吧~</p>
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
