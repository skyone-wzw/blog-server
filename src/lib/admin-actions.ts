"use server";

import ParseArticleImages from "@/components/markdown/ParseAticleImages";
import config from "@/config";
import {DEFAULT_ARTICLE_PER_PAGE, getAllArticleCount, getRecentArticles} from "@/lib/article";
import {isUserLoggedIn} from "@/lib/auth";
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

        for (let i = 0; i < pages; i++) {
            const articles = await getRecentArticles({page: i});
            for (const article of articles) {
                const images = await ParseArticleImages(article.content);
                images.forEach((image) => imageSet.add(image));
            }
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
