import prisma from "@/lib/prisma";
import {cache} from "react";

export interface ArticleMetadata {
    id: string;
    title: string;
    slug: string;
    description: string;
    series: string;
    tags: string[];
    published: boolean;
    createdAt: Date;
    updatedAt: Date;
    metadata: any;
}

export interface Article extends ArticleMetadata {
    content: string;
}

export interface ArticlePatch {
    id: string;
    title?: string;
    slug?: string;
    description?: string;
    series?: string;
    tags?: string[];
    published?: boolean;
    content?: string;
    metadata?: any;
}

export interface ArticleCreate {
    title: string;
    slug: string;
    description: string;
    series: string;
    tags: string[];
    published: boolean;
    content: string;
    metadata?: any;
}

export const getAllArticlesMetadata = cache(async (published: boolean = true): Promise<ArticleMetadata[]> => {
    return prisma.post.findMany({
        where: {
            published: published,
        },
        select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            series: true,
            tags: true,
            published: true,
            createdAt: true,
            updatedAt: true,
            metadata: true,
        },
    });
})

interface ArticleSeries {
    series: string;
    count: number;
}

export const getAllSeries = cache(async (published: boolean = true): Promise<ArticleSeries[]> => {
    const result = await prisma.post.findMany({
        where: {
            published: published,
        },
        select: {
            series: true,
        },
    });

    const seriesMap = new Map<string, number>();
    result.forEach((post) => {
        if (post.series) {
            if (seriesMap.has(post.series)) {
                seriesMap.set(post.series, seriesMap.get(post.series)! + 1);
            } else {
                seriesMap.set(post.series, 1);
            }
        }
    });

    const series = Array.from(seriesMap.keys());
    return series.map(s => ({
        series: s,
        count: seriesMap.get(s)!,
    }));
});

interface ArticleTag {
    tag: string;
    count: number;
}

export const getAllTags = cache(async (published: boolean = true): Promise<ArticleTag[]> => {
    const result = await prisma.post.findMany({
        where: {
            published: published,
        },
        select: {
            tags: true,
        },
    });

    const tagMap = new Map<string, number>();
    result.forEach((post) => {
        const tags = Array.from(new Set(post.tags));
        tags.forEach((tag) => {
            if (tagMap.has(tag)) {
                tagMap.set(tag, tagMap.get(tag)! + 1);
            } else {
                tagMap.set(tag, 1);
            }
        });
    });

    const tags = Array.from(tagMap.keys());
    return tags.map(t => ({
        tag: t,
        count: tagMap.get(t)!,
    }));
});

interface ArticleYear {
    year: number;
    count: number;
}

export const getAllYears = cache(async (published: boolean = true): Promise<ArticleYear[]> => {
    const result = await prisma.post.findMany({
        where: {
            published: published,
        },
        select: {
            createdAt: true,
        },
    });

    const yearMap = new Map<number, number>();
    result.forEach((post) => {
        const year = post.createdAt.getFullYear();
        if (yearMap.has(year)) {
            yearMap.set(year, yearMap.get(year)! + 1);
        } else {
            yearMap.set(year, 1);
        }
    });

    const years = Array.from(yearMap.keys());
    return years.sort((a, b) => b - a).map(y => ({
        year: y,
        count: yearMap.get(y)!,
    }));
});

export const DEFAULT_ARTICLE_PER_PAGE = 5;

interface GetRecentArticlesOptions {
    published?: boolean;
    limit?: number;
    page?: number;
}

export const getRecentArticles = cache(async (options: GetRecentArticlesOptions = {}): Promise<ArticleMetadata[]> => {
    const where = options.published ? {published: options.published} : {};
    const take = options.limit ? options.limit : DEFAULT_ARTICLE_PER_PAGE;
    const skip = options.page ? (options.page - 1) * take : 0;
    return prisma.post.findMany({
        where: where,
        orderBy: {
            createdAt: "desc",
        },
        skip: skip,
        take: take,
        select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            series: true,
            tags: true,
            published: true,
            createdAt: true,
            updatedAt: true,
            metadata: true,
        },
    });
});

export const getArticleBySlug = cache(async (slug: string, published: boolean = true): Promise<Article | null> => {
    return prisma.post.findUnique({
        where: {
            slug: slug,
            published: published,
        },
        select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            series: true,
            tags: true,
            published: true,
            createdAt: true,
            updatedAt: true,
            content: true,
            metadata: true,
        },
    });
});

export const getArticleMetadataBySlug = cache(async (slug: string, published: boolean = true): Promise<ArticleMetadata | null> => {
    return prisma.post.findUnique({
        where: {
            slug: slug,
            published: published,
        },
        select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            series: true,
            tags: true,
            published: true,
            createdAt: true,
            updatedAt: true,
            metadata: true,
        },
    });
});

export const getArticlesBySeries = cache(async (series: string, published: boolean = true): Promise<ArticleMetadata[]> => {
    return prisma.post.findMany({
        where: {
            series: series,
            published: published,
        },
        select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            series: true,
            tags: true,
            published: true,
            createdAt: true,
            updatedAt: true,
            metadata: true,
        },
    });
});

export const getArticlesByTag = cache(async (tag: string, published: boolean = true): Promise<ArticleMetadata[]> => {
    return prisma.post.findMany({
        where: {
            tags: {
                has: tag,
            },
            published: published,
        },
        select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            series: true,
            tags: true,
            published: true,
            createdAt: true,
            updatedAt: true,
            metadata: true,
        },
    });
});

export const getArticlesByYear = cache(async (year: number, published: boolean = true): Promise<ArticleMetadata[]> => {
    const start = new Date(year, 0, 1);
    const end = new Date(year + 1, 0, 1);
    return prisma.post.findMany({
        where: {
            createdAt: {
                gte: start,
                lt: end,
            },
            published: published,
        },
        select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            series: true,
            tags: true,
            published: true,
            createdAt: true,
            updatedAt: true,
            metadata: true,
        },
    });
});

export const getAllArticleCount = cache(async (published: boolean = true): Promise<number> => {
    return prisma.post.count({
        where: {
            published: published,
        },
    });
});
