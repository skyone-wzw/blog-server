import prisma from "@/lib/prisma";
import {ObjectPick} from "@/lib/type-utils";
import {cache} from "react";

namespace Database {
    export interface CustomPageEntity {
        id: string;
        slug: string;
        title: string;
        description: string;
        content: string;
        createdAt: Date;
        updatedAt: Date;
    }
}

export interface CustomPageMetadata {
    id: string;
    slug: string;
    title: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CustomPage extends CustomPageMetadata {
    content: string;
}

export interface CustomPagePatch {
    id: string;
    slug?: string;
    title?: string;
    description?: string;
    content?: string;
    updatedAt?: Date;
}

export interface CustomPageCreate {
    slug: string;
    title: string;
    description: string;
    content: string;
}

const CustomPageSelector = {
    id: true,
    slug: true,
    title: true,
    description: true,
    content: true,
    createdAt: true,
    updatedAt: true,
};

const CustomPageMetadataSelector = {
    id: true,
    slug: true,
    title: true,
    description: true,
    createdAt: true,
    updatedAt: true,
};

export const CustomPageReservedPrefix = [
    "post", "admin", "editor", "api", "assets", "login", "tags",
    "series", "search", "archive", "sitemap", "robots.txt", "favicon",
    "atom.xml", "new",
];
export const CustomPageReservedPrefixRegex = RegExp(`^\\/(?:${CustomPageReservedPrefix.join("|")})(\/|$)`);

export const getAllCustomPagesMetadata = cache(async () => {
    return prisma.customPage.findMany({
        select: CustomPageMetadataSelector,
    });
});

export const getAllCustomPages = cache(async () => {
    return prisma.customPage.findMany({
        select: CustomPageSelector,
    });
});

export const getCustomPageBySlug = cache(async (slug: string) => {
    return prisma.customPage.findUnique({
        where: {slug},
        select: CustomPageSelector,
    });
});

export const patchCustomPage = async (page: CustomPagePatch) => {
    try {
        return await prisma.customPage.update({
            where: {id: page.id},
            data: {
                ...ObjectPick(page,
                    ["slug", "title", "description", "content"]),
                updatedAt: page.updatedAt ?? new Date(),
            },
            select: CustomPageSelector,
        });
    } catch (e) {
        return null;
    }
};

export const createCustomPage = async (page: CustomPageCreate) => {
    try {
        return await prisma.customPage.create({
            data: {
                ...ObjectPick(page,
                    ["slug", "title", "description", "content"]),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            select: CustomPageSelector,
        });
    } catch (e) {
        return null;
    }
};

export const deleteCustomPage = async (id: string) => {
    try {
        return await prisma.customPage.delete({
            where: {id},
            select: CustomPageSelector,
        });
    } catch (e) {
        return null;
    }
};
