import {FriendLinkCreator, FriendLinkEditor} from "@/app/(admin)/admin/friends/FriendLinkEditor";
import Paper from "@/components/base/Paper";
import {getAvatarElement} from "@/components/FriendCard";
import {getAllFriends} from "@/lib/friends";

// FIXME 在编辑完成后无法实时显示数据, 必须刷新页面, 暂时不知道怎么解决
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
                        <p className="text-sm text-text-subnote">在编辑完成后无法实时显示数据, 必须刷新页面, 暂时不知道怎么解决</p>
                    </Paper>
                    <div className="grid grid-cols-2 flex-wrap gap-4 @container">
                        {friends.map((friend) => (
                            <FriendLinkEditor
                                key={friend.id}  friend={friend} avatarElement={getAvatarElement(friend)}
                                className="col-span-full @[640px]:col-span-1"/>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}

export default AdminFriendsPage;
