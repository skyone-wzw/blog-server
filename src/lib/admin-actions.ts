"use server";

import generateCover from "@/app/api/cover/[slug]/generate-cover";
import ParseArticleImages from "@/components/markdown/ParseAticleImages";
import {PreprocessArticleContent} from "@/components/markdown/server-content-processor";
import {PreprocessArticleTitle} from "@/components/markdown/title-processor";
import config from "@/config";
import {DEFAULT_ARTICLE_PER_PAGE, getAllArticleCount, getRecentArticles} from "@/lib/article";
import {isUserLoggedIn} from "@/lib/auth";
import {getAllCustomPages} from "@/lib/custom-page";
import fs from "fs/promises";
import {getTranslations} from "next-intl/server";
import {redirect, RedirectType} from "next/navigation";
import {getAllCommentCount, getRecentCommentsMetadata, updateCommentAst} from "@/lib/comment";
import {PreprocessCommentHtml, PreprocessCommentSource} from "@/components/markdown/server-comment-processor";

export interface QuickActionResult {
    success: boolean;
    message: string;
}

const imageDir = config.dir.image;

export async function RemoveUnusedAssetsAction() {
    if (!await isUserLoggedIn()) redirect("/login", RedirectType.replace);
    const t = await getTranslations("actions.RemoveUnusedAssetsAction");

    async function removeUnusedAssets() {
        const count = await getAllArticleCount();
        const pages = Math.ceil(count / DEFAULT_ARTICLE_PER_PAGE);
        const imageSet = new Set<string>();

        for (let i = 1; i <= pages; i++) {
            const articles = await getRecentArticles({page: i});
            for (const article of articles) {
                const images = await ParseArticleImages(article.content);
                images.forEach((image) => imageSet.add(image));
            }
        }
        const customPages = await getAllCustomPages();
        for (const page of customPages) {
            const images = await ParseArticleImages(page.content);
            images.forEach((image) => imageSet.add(image));
        }

        const imagesName = Array.from(imageSet)
            .map(url => url.split("/").pop());

        const files = await fs.readdir(imageDir);
        for (const file of files) {
            if (!imagesName.includes(file)) {
                await fs.rm(`${imageDir}/${file}`).catch(() => {});
            }
        }
    }

    setTimeout(removeUnusedAssets, 0);

    return {
        success: true,
        message: t("ok"),
    };
}

export async function RemoveArticleCacheAction() {
    if (!await isUserLoggedIn()) redirect("/login", RedirectType.replace);
    const t = await getTranslations("actions.RemoveArticleCacheAction");

    async function removeContentCache() {
        const files = await fs.readdir(config.dir.cache);
        for (const file of files) {
            if (!file.endsWith(".json")) continue;
            await fs.rm(`${config.dir.cache}/${file}`).catch(() => {});
        }
    }

    setTimeout(removeContentCache, 0);

    return {
        success: true,
        message: t("ok"),
    };
}

export async function PreprocessArticleAction() {
    if (!await isUserLoggedIn()) redirect("/login", RedirectType.replace);
    const t = await getTranslations("actions.PreprocessArticleAction");

    async function preprocessContent() {
        const count = await getAllArticleCount();
        const pages = Math.ceil(count / DEFAULT_ARTICLE_PER_PAGE);

        for (let i = 1; i <= pages; i++) {
            const articles = await getRecentArticles({page: i});
            for (const article of articles) {
                await PreprocessArticleContent(article);
                await PreprocessArticleTitle(article);
            }
        }

        const customPages = await getAllCustomPages();
        for (const page of customPages) {
            await PreprocessArticleContent(page);
            await PreprocessArticleTitle(page);
        }
    }

    try {
        await preprocessContent();
        return {
            success: true,
            message: t("ok"),
        };
    } catch (e: any) {
        return {
            success: false,
            message: t("error", {error: e?.message ?? e}),
        };
    }
}

export async function RemoveCoverCacheAction() {
    if (!await isUserLoggedIn()) redirect("/login", RedirectType.replace);
    const t = await getTranslations("actions.RemoveCoverCacheAction");

    async function removeCoverCache() {
        const files = await fs.readdir(config.dir.cache);
        for (const file of files) {
            if (!file.endsWith(".png")) continue;
            await fs.rm(`${config.dir.cache}/${file}`).catch(() => {});
        }
    }

    setTimeout(removeCoverCache, 0);

    return {
        success: true,
        message: t("ok"),
    };
}

export async function GenerateCoverAction() {
    if (!await isUserLoggedIn()) redirect("/login", RedirectType.replace);
    const t = await getTranslations("actions.GenerateCoverAction");

    async function generateCovers() {
        const count = await getAllArticleCount();
        const pages = Math.ceil(count / DEFAULT_ARTICLE_PER_PAGE);

        for (let i = 1; i <= pages; i++) {
            const articles = await getRecentArticles({page: i});
            for (const article of articles) {
                await generateCover(article);
            }
        }
    }

    try {
        await generateCovers();
    } catch (e) {
    }

    return {
        success: true,
        message: t("ok"),
    };
}

export async function PreprocessCommentAction() {
    if (!await isUserLoggedIn()) redirect("/login", RedirectType.replace);
    const t = await getTranslations("actions.PreprocessCommentAction");

    async function preprocessComments() {
        const count = await getAllCommentCount();
        const pages = Math.ceil(count / 5);

        for (let i = 1; i <= pages; i++) {
            const comments = await getRecentCommentsMetadata({page: i});
            for (const comment of comments) {
                const ast = comment.source
                    ? await PreprocessCommentSource(comment.source)
                    : await PreprocessCommentHtml(comment.content);
                await updateCommentAst(comment.uid, JSON.stringify(ast));
            }
        }
    }

    try {
        await preprocessComments();
        return {
            success: true,
            message: t("ok"),
        };
    } catch (e: any) {
        return {
            success: false,
            message: t("error", {error: e?.message ?? e}),
        };
    }
}
