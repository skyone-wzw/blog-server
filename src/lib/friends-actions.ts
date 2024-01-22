"use server";

import {isUserLoggedIn} from "@/lib/auth";
import {createFriend, deleteFriend, FriendCreate, FriendPatch, patchFriend} from "@/lib/friends";
import {redirect, RedirectType} from "next/navigation";

export async function CreateFriendAction(friend: FriendCreate) {
    if (!await isUserLoggedIn()) redirect("/login", RedirectType.replace);

    if (!friend.name) return false;
    if (!friend.siteName) return false;
    if (!friend.siteUrl) return false;
    friend.description = friend.description || "";

    return await createFriend(friend);
}

export async function SaveFriendAction(friend: FriendPatch) {
    if (!await isUserLoggedIn()) redirect("/login", RedirectType.replace);

    return await patchFriend(friend);
}

export async function DeleteFriendAction(friendId: number) {
    if (!await isUserLoggedIn()) redirect("/login", RedirectType.replace);

    return await deleteFriend(friendId);
}
