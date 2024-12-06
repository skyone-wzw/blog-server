import prisma from "@/lib/prisma";
import {cache} from "react";

export interface FediverseGuest {
    id: number;
    name: string;
    uid: string;
    summary?: string | null;
    banner?: string | null;
    url: string;
    webUrl?: string | null;
    avatar?: string | null;
    isBanned: boolean;
}

export interface FediverseGuestWithPublicKey extends FediverseGuest {
    publicKey: string;
}

export interface FediverseComment {
    id: number;
    uid: string;
    userId: string;
    parsed: string;
    replyTo?: string | null;
    postId: string;
    createdAt: Date;
    updatedAt: Date;
    isHidden: boolean;
}

export interface FediverseCommentMetadata {
    id: number;
    uid: string;
    userId: string;
    content: string;
    source?: string | null;
    replyTo?: string | null;
    postId: string;
    createdAt: Date;
    updatedAt: Date;
    isHidden: boolean;
}

const FediverseGuestSelector = {
    id: true,
    name: true,
    uid: true,
    summary: true,
    banner: true,
    url: true,
    webUrl: true,
    avatar: true,
    isBanned: true,
}

const FediverseGuestWithPublicKeySelector = {
    id: true,
    name: true,
    uid: true,
    summary: true,
    banner: true,
    url: true,
    webUrl: true,
    avatar: true,
    isBanned: true,
    publicKey: true,
}

const FediverseCommentWithGuestSelector = {
    id: true,
    uid: true,
    userId: true,
    parsed: true,
    replyTo: true,
    postId: true,
    createdAt: true,
    updatedAt: true,
    isHidden: true,
    user: {
        select: FediverseGuestSelector,
    },
}

const FediverseCommentMetadataSelector = {
    id: true,
    uid: true,
    userId: true,
    content: true,
    source: true,
    replyTo: true,
    postId: true,
    createdAt: true,
    updatedAt: true,
    isHidden: true,
}

export interface FediverseCommentWithGuest extends FediverseComment {
    user: FediverseGuest;
}

export function Database2Object<T extends object>(database: T): T {
    return {...database};
}

export const getGuestByUid = cache(async (uid: string): Promise<FediverseGuestWithPublicKey | null> => {
    const guest = await prisma.fediverseGuest.findUnique({
        where: {
            uid,
        },
        select: FediverseGuestWithPublicKeySelector,
    });
    return guest ? Database2Object(guest) : null;
});

export const getGuestByKeyId = cache(async (keyId: string): Promise<FediverseGuestWithPublicKey | null> => {
    const guest = await prisma.fediverseGuest.findFirst({
        where: {
            publicKey: keyId,
        },
        select: FediverseGuestWithPublicKeySelector,
    });
    if (!guest) return null;
    return Database2Object(guest);
});

export const getCommentsByArticleId = cache(async (articleId: string): Promise<FediverseCommentWithGuest[]> => {
    const comments = await prisma.fediverseComment.findMany({
        where: {
            postId: articleId,
            isHidden: false,
            user: {
                isBanned: false,
            },
        },
        select: FediverseCommentWithGuestSelector,
        orderBy: {
            createdAt: "desc",
        },
    });
    return comments.map(Database2Object);
});

export const getAllCommentCount = cache(async (): Promise<number> => {
    return prisma.fediverseComment.count({
        where: {
            isHidden: false,
            user: {
                isBanned: false,
            },
        },
    });
});

interface GetRecentCommentsOptions {
    limit?: number;
    page?: number;
}

export const getRecentCommentsMetadata = cache(async ({
                                                          limit = 10,
                                                          page = 1,
                                                      }: GetRecentCommentsOptions): Promise<FediverseCommentMetadata[]> => {
    const comments = await prisma.fediverseComment.findMany({
        where: {
            isHidden: false,
            user: {
                isBanned: false,
            },
        },
        select: FediverseCommentMetadataSelector,
        orderBy: {
            createdAt: "desc",
        },
        skip: (page - 1) * limit,
        take: limit,
    });
    return comments.map(Database2Object);
});

export const getAllComments = cache(async (): Promise<Omit<FediverseComment, "parsed">[]> => {
    const comments = await prisma.fediverseComment.findMany({
        where: {
            isHidden: false,
            user: {
                isBanned: false,
            },
        },
        select: {
            id: true,
            uid: true,
            userId: true,
            replyTo: true,
            postId: true,
            createdAt: true,
            updatedAt: true,
            isHidden: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return comments.map(Database2Object);
});

export const updateCommentAst = async (uid: string, ast: string): Promise<void> => {
    await prisma.fediverseComment.update({
        where: {
            uid,
        },
        data: {
            parsed: ast,
        },
    });
};
