import {AES} from "@/lib/encrypt";
import L from "@/lib/links";
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

export interface ClientFriend {
    id: number;
    name: string;
    avatar?: string;
    siteName: string;
    siteUrl: string;
    description: string;
    createdAt: Date;
    deletedAt?: Date;
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

export function toClientFriend(friend: Friend): ClientFriend {
    let avatar = friend.avatar;
    if (!avatar) {
        if (friend.email) {
            avatar = L.avatar.email(AES.encrypt(friend.email));
        }
    }
    return {
        id: friend.id,
        name: friend.name,
        avatar: avatar || undefined,
        siteName: friend.siteName,
        siteUrl: friend.siteUrl,
        description: friend.description,
        createdAt: friend.createdAt,
        deletedAt: friend.deletedAt || undefined,
    };
}

export const getAllFriends = cache(async (deleted: boolean = false): Promise<Friend[]> => {
    const where = {
        deletedAt: deleted ? {not: null} : null,
    };
    return prisma.friend.findMany({
        where: where,
        select: FriendSelector,
    });
});

export const gatAllClientFriends = cache(async (deleted: boolean = false): Promise<ClientFriend[]> => {
    const friends = await getAllFriends(deleted);
    return friends.map(toClientFriend);
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
