"use server";

import {GetCommentOptions, getCommentsWithGuestByOption} from "@/lib/comment";
import prisma from "@/lib/prisma";

export async function FetchCommentsAction(option?: GetCommentOptions) {
    return await getCommentsWithGuestByOption(option);
}

export async function UpdateGuestAction(uid: string, isBanned: boolean) {
    try {
        await prisma.fediverseGuest.update({
            where: {
                uid
            },
            data: {
                isBanned
            }
        });
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
                uid
            },
            data: {
                isHidden
            }
        });
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}
