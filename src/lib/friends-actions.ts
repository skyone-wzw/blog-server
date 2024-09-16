"use server";

import {isUserLoggedIn} from "@/lib/auth";
import {createFriend, deleteFriend, FriendCreate, FriendPatch, patchFriend} from "@/lib/friends";
import {revalidatePath} from "next/cache";
import {redirect, RedirectType} from "next/navigation";

export async function CreateFriendAction(friend: FriendCreate) {
    if (!await isUserLoggedIn()) redirect("/login", RedirectType.replace);

    if (!friend.name) return false;
    if (!friend.siteName) return false;
    if (!friend.siteUrl) return false;
    friend.description = friend.description || "";

    const result = await createFriend(friend);

    revalidatePath("/admin/friends", "page");
    revalidatePath("/friends", "page");
    return result;
}

export async function SaveFriendAction(friend: FriendPatch) {
    if (!await isUserLoggedIn()) redirect("/login", RedirectType.replace);

    const result = await patchFriend(friend);

    revalidatePath("/admin/friends", "page");
    revalidatePath("/friends", "page");
    return result;
}

export async function DeleteFriendAction(friendId: number) {
    if (!await isUserLoggedIn()) redirect("/login", RedirectType.replace);

    const result = await deleteFriend(friendId);

    revalidatePath("/admin/friends", "page");
    revalidatePath("/friends", "page");
    return result;
}
