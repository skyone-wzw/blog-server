import Paper from "@/components/base/Paper";
import FriendCard from "@/components/FriendCard";
import config from "@/config";
import {gatAllClientFriends} from "@/lib/friends";
import {notFound} from "next/navigation";

export const metadata = {
    title: `友情链接 - ${config.title}`,
    description: `${config.master.name} 的朋友们`,
};

async function FriendsPage() {
    const friends = await gatAllClientFriends();
    if (friends.length === 0) return notFound();

    return (
        <>
            <Paper className="p-6">
                <span className="text-text-content text-lg mr-3">我的朋友们</span>
                <span className="text-text-subnote">共 {friends.length} 条</span>
            </Paper>
            <div className="grid grid-cols-2 flex-wrap gap-4 @container">
                {friends.map((friend) => (
                    <FriendCard key={friend.id} className="col-span-full @[640px]:col-span-1" friend={friend}/>
                ))}
            </div>
        </>
    );
}

export default FriendsPage;
