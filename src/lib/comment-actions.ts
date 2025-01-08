"use server";

import {deleteComment, deleteGuest, GetCommentOptions, getCommentsWithGuestByOption} from "@/lib/comment";
import prisma from "@/lib/prisma";
import {revalidatePath} from "next/cache";
import L from "@/lib/links";

export async function FetchCommentsAction(option?: GetCommentOptions) {
    return await getCommentsWithGuestByOption(option);
}

export async function UpdateGuestAction(uid: string, isBanned: boolean) {
    try {
        await prisma.fediverseGuest.update({
            where: {
                uid,
            },
            data: {
                isBanned,
            },
        });

        revalidatePath(L.admin("comments"));
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}

export async function UpdateCommentAction(uid: string, isHidden: boolean) {
    try {
        await prisma.fediverseComment.update({
            where: {
                uid,
            },
            data: {
                isHidden,
            },
        });

        revalidatePath(L.admin("comments"));
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}

export async function DeleteCommentAction(uid: string) {
    const result = await deleteComment(uid);
    if (result) revalidatePath(L.admin("comments"));
    return result;
}

export async function DeleteGuestAction(uid: string) {
    const result = await deleteGuest(uid);
    if (result) revalidatePath(L.admin("comments"));
    return result;
}
