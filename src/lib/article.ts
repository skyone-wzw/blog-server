import prisma from "@/lib/prisma";
import {ObjectPick} from "@/lib/type-utils";
import {cache} from "react";

export interface ArticleTitle {
    id: string;
    slug: string;
    title: string;
    createdAt: Date;
}

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
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ArticleCreate {
    title: string;
    slug: string;
    description: string;
    series: string;
    tags: string[];
    published: boolean;
    content: string;
}

const ArticleSelector = {
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
};

const ArticleMetadataSelector = {
    id: true,
    title: true,
    slug: true,
    description: true,
    series: true,
    tags: true,
    published: true,
    createdAt: true,
    updatedAt: true,
};

// 如果 E[K] 是非可选 P 类型, 则将 E[K] 替换为 R 类型, 否则将 E[K] 替换为可选的 R 类型
// 希望下次看到它的时候我能看懂 (2024-01-03)
type TypeReplaceIf<E, K extends keyof E, P, R> = E[K] extends P ?
    (Omit<E, K> & { [key in K]: R }) :
    (Omit<E, K> & { [key in K]?: R });

export function Database2Article<T extends { tags?: string }>(article: T): TypeReplaceIf<T, "tags", string, string[]> {
    return typeof article.tags === "string" ?
        {...article, tags: JSON.parse(article.tags) as string[]} :
        (article as T & { tags: string[] });
}

export function Article2Database<T extends {
    tags?: string[]
}>(article: T): TypeReplaceIf<T, "tags", string[], string> {
    return Array.isArray(article.tags) ? {...article, tags: JSON.stringify(article.tags)} : (article as T & {
        tags: string
    });
}

export const getAllArticlesMetadata = cache(async (published: boolean = true): Promise<ArticleMetadata[]> => {
    const articles = await prisma.post.findMany({
        where: {
            published: published,
        },
        orderBy: {
            createdAt: "desc",
        },
        select: ArticleMetadataSelector,
    });
    return articles.map(Database2Article);
});

export const getAllArticlesTitle = cache(async (published: boolean = true): Promise<ArticleTitle[]> => {
    const articles = await prisma.post.findMany({
        where: {
            published: published,
        },
        select: {
            id: true,
            slug: true,
            title: true,
            createdAt: true,
        },
    });
    return articles.map(article => ({...article}));
});

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

    const allTag = result.map(Database2Article).flatMap(a => a.tags);
    const tagMap = new Map<string, number>();
    allTag.forEach(tag => {
        if (tagMap.has(tag)) {
            tagMap.set(tag, tagMap.get(tag)! + 1);
        } else {
            tagMap.set(tag, 1);
        }
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

export const getRecentArticles = cache(async (options: GetRecentArticlesOptions = {published: true}): Promise<Article[]> => {
    const where = options.published ? {published: options.published} : {};
    const take = options.limit ? options.limit : DEFAULT_ARTICLE_PER_PAGE;
    const skip = options.page ? (options.page - 1) * take : 0;
    const articles = await prisma.post.findMany({
        where: where,
        orderBy: {
            createdAt: "desc",
        },
        skip: skip,
        take: take,
        select: ArticleSelector,
    });
    return articles.map(Database2Article);
});

export const getRecentArticlesMetadata = cache(async (options: GetRecentArticlesOptions = {published: true}): Promise<ArticleMetadata[]> => {
    const where = options.published ? {published: options.published} : {};
    const take = options.limit ? options.limit : DEFAULT_ARTICLE_PER_PAGE;
    const skip = options.page ? (options.page - 1) * take : 0;
    const articles = await prisma.post.findMany({
        where: where,
        orderBy: {
            createdAt: "desc",
        },
        skip: skip,
        take: take,
        select: ArticleMetadataSelector,
    });
    return articles.map(Database2Article);
});

export const getArticleBySlug = cache(async (slug: string, published: boolean = true): Promise<Article | null> => {
    const article = await prisma.post.findUnique({
        where: {
            slug: slug,
            published: published ? published : undefined,
        },
        select: ArticleSelector,
    });
    return article && Database2Article(article);
});

export const getArticleMetadataById = cache(async (id: string, published: boolean = true): Promise<ArticleMetadata | null> => {
    const article = await prisma.post.findUnique({
        where: {
            id: id,
            published: published ? published : undefined,
        },
        select: ArticleMetadataSelector,
    });
    return article && Database2Article(article);
});

export const getArticleMetadataBySlug = cache(async (slug: string, published: boolean = true): Promise<ArticleMetadata | null> => {
    const article = await prisma.post.findUnique({
        where: {
            slug: slug,
            published: published ? published : undefined,
        },
        select: ArticleMetadataSelector,
    });
    return article && Database2Article(article);
});

export const getArticlesBySeries = cache(async (series: string, published: boolean = true): Promise<ArticleMetadata[]> => {
    const articles = await prisma.post.findMany({
        where: {
            series: series,
            published: published ? published : undefined,
        },
        orderBy: {
            createdAt: "desc",
        },
        select: ArticleMetadataSelector,
    });
    return articles.map(Database2Article);
});

export const getArticlesByTag = cache(async (tag: string, published: boolean = true): Promise<ArticleMetadata[]> => {
    const articles = await prisma.post.findMany({
        where: {
            tags: {
                contains: tag,
            },
            published: published ? published : undefined,
        },
        orderBy: {
            createdAt: "desc",
        },
        select: ArticleMetadataSelector,
    });
    return articles.map(Database2Article);
});

export const getArticlesByYear = cache(async (year: number, published: boolean = true): Promise<ArticleMetadata[]> => {
    const start = new Date(year, 0, 1);
    const end = new Date(year + 1, 0, 1);
    const articles = await prisma.post.findMany({
        where: {
            createdAt: {
                gte: start,
                lt: end,
            },
            published: published ? published : undefined,
        },
        orderBy: {
            createdAt: "desc",
        },
        select: ArticleMetadataSelector,
    });
    return articles.map(Database2Article);
});

interface GetArticlesByYearPaginateOptions {
    published?: boolean;
    limit?: number;
    page?: number;
}

export const getArticlesByYearPaginate = cache(async (year: number, options: GetArticlesByYearPaginateOptions = {published: true}) => {
    const {published, limit, page} = options;
    const start = new Date(year, 0, 1);
    const end = new Date(year + 1, 0, 1);
    const where = {
        createdAt: {
            gte: start,
            lt: end,
        },
        published: published ? published : undefined,
    };
    const take = limit ? limit : DEFAULT_ARTICLE_PER_PAGE;
    const skip = page ? (page - 1) * take : 0;
    const articles = await prisma.post.findMany({
        where: where,
        orderBy: {
            createdAt: "desc",
        },
        skip: skip,
        take: take,
        select: ArticleMetadataSelector,
    });
    return articles.map(Database2Article);
});

export const getArticleCountByYear = cache(async (year: number, published: boolean = true): Promise<number> => {
    const start = new Date(year, 0, 1);
    const end = new Date(year + 1, 0, 1);
    return prisma.post.count({
        where: {
            createdAt: {
                gte: start,
                lt: end,
            },
            published: published ? published : undefined,
        },
    });
});

interface AdjacentArticle {
    prev: ArticleMetadata | null;
    next: ArticleMetadata | null;
}

export const getAdjacentArticleMetadata = cache(async (slug: string, published: boolean = true): Promise<AdjacentArticle> => {
    return prisma.$transaction(async (prisma) => {
        const current = await prisma.post.findUnique({
            where: {
                slug: slug,
            },
            select: {
                createdAt: true,
            },
        });
        if (!current) {
            return {
                prev: null,
                next: null,
            };
        }
        const prev = await prisma.post.findFirst({
            where: {
                published: published ? published : undefined,
                createdAt: {
                    lt: current.createdAt,
                },
            },
            orderBy: {
                createdAt: "desc",
            },
            select: ArticleMetadataSelector,
        });
        const next = await prisma.post.findFirst({
            where: {
                published: published ? published : undefined,
                createdAt: {
                    gt: current.createdAt,
                },
            },
            orderBy: {
                createdAt: "asc",
            },
            select: ArticleMetadataSelector,
        });
        return {
            prev: prev && Database2Article(prev),
            next: next && Database2Article(next),
        };
    });
});

export const getAllArticleCount = cache(async (published: boolean = true): Promise<number> => {
    return prisma.post.count({
        where: {
            published: published ? published : undefined,
        },
    });
});

export const createArticle = cache(async (article: ArticleCreate) => {
    try {
        return await prisma.post.create({
            data: ObjectPick(Article2Database(article),
                ["title", "slug", "description", "series", "tags", "published", "content"]),
            select: ArticleSelector,
        });
    } catch (e) {
        return null;
    }
});

export const patchArticle = cache(async (article: ArticlePatch) => {
    try {
        return await prisma.post.update({
            where: {
                id: article.id,
            },
            data: {
                ...ObjectPick(Article2Database(article),
                    ["title", "slug", "description", "series", "tags", "published", "content", "createdAt"]),
                updatedAt: new Date(),
            },
            select: ArticleSelector,
        });
    } catch (e) {
        return null;
    }
});

export const deleteArticle = cache(async (id: string) => {
    try {
        return await prisma.post.delete({
            where: {
                id: id,
            },
            select: ArticleMetadataSelector,
        });
    } catch (e) {
        return null;
    }
});

export const getArticleTextSum = cache(async (): Promise<BigInt> => {
    const result: { total: BigInt }[] = await prisma.$queryRaw`
        SELECT SUM(LENGTH(content)) as total
        FROM posts;
    `;
    return result.pop()?.total ?? BigInt(-1);
});
