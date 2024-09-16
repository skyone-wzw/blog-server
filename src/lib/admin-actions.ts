"use server";

import ParseArticleImages from "@/components/markdown/ParseAticleImages";
import {PreprocessArticleContent} from "@/components/markdown/server-content-processor";
import {PreprocessArticleTitle} from "@/components/markdown/title-processor";
import config from "@/config";
import {DEFAULT_ARTICLE_PER_PAGE, getAllArticleCount, getRecentArticles} from "@/lib/article";
import {isUserLoggedIn} from "@/lib/auth";
import {getAllCustomPages} from "@/lib/custom-page";
import fs from "fs/promises";
import {redirect, RedirectType} from "next/navigation";

export interface QuickActionResult {
    success: boolean;
    message: string;
}

const imageDir = config.dir.image;

export async function RemoveUnusedAssetsAction() {
    if (!await isUserLoggedIn()) redirect("/login", RedirectType.replace);

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
        message: "任务正在后台执行中，请稍后查看结果。",
    };
}

export async function RemoveArticleCacheAction() {
    if (!await isUserLoggedIn()) redirect("/login", RedirectType.replace);

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
        message: "任务正在后台执行中，请稍后查看结果。",
    };
}

export async function PreprocessArticleAction() {
    if (!await isUserLoggedIn()) redirect("/login", RedirectType.replace);

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
            message: "任务已完成。",
        };
    } catch (e: any) {
        return {
            success: false,
            message: `任务失败：${e?.message ?? e}`,
        };
    }
}
