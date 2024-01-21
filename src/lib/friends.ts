import prisma from "@/lib/prisma";
import {ObjectPick} from "@/lib/type-utils";
import {cache} from "react";

export interface Friend {
    id: number;
    name: string;
    email: string | null;
    avatar: string | null;
    siteName: string;
    siteUrl: string;
    description: string;
    createdAt: Date;
    deletedAt: Date | null;
}

export interface FriendCreate {
    name: string;
    email?: string;
    avatar?: string;
    siteName: string;
    siteUrl: string;
    description: string;
    createdAt?: Date;
    deletedAt?: Date;
}

export interface FriendPatch {
    id: number;
    name?: string;
    email?: string;
    avatar?: string;
    siteName?: string;
    siteUrl?: string;
    description?: string;
    createdAt?: Date;
    deletedAt?: Date;
}

const FriendSelector = {
    id: true,
    name: true,
    email: true,
    avatar: true,
    siteName: true,
    siteUrl: true,
    description: true,
    createdAt: true,
    deletedAt: true,
};

export const getAllFriends = cache(async (deleted: boolean = false): Promise<Friend[]> => {
    const where = {
        deletedAt: deleted ? {not: null} : null,
    };
    return prisma.friend.findMany({
        where: where,
        select: FriendSelector,
    });
});

export async function createFriend(friend: FriendCreate) {
    try {
        await prisma.friend.create({
            data: ObjectPick(friend,
                ["name", "email", "avatar", "siteName", "siteUrl", "description", "createdAt", "deletedAt"]),
        });
        return true;
    } catch (e) {
        return false;
    }
}

export async function patchFriend(friend: FriendPatch): Promise<boolean> {
    try {
        await prisma.friend.update({
            where: {
                id: friend.id,
            },
            data: ObjectPick(friend,
                ["name", "email", "avatar", "siteName", "siteUrl", "description", "createdAt", "deletedAt"]),
        });
        return true;
    } catch (e) {
        return false;
    }
}

export async function deleteFriend(id: number) {
    try {
        await prisma.friend.delete({
            where: {
                id: id,
            },
        });
        return true;
    } catch (e) {
        return false;
    }
}
