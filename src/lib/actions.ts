"use server";

import config from "@/config";
import {ArticleCreate, ArticlePatch, createArticle, deleteArticle, patchArticle} from "@/lib/article";
import {generateToken, isUserLoggedIn} from "@/lib/auth";
import {HASH} from "@/lib/encrypt";
import fs from "fs/promises";
import {cookies} from "next/headers";
import {redirect, RedirectType} from "next/navigation";

export async function LoginAction(email: string, password: string) {
    if (email === config.auth.email && password === config.auth.password) {
        const cookie = cookies();
        cookie.set({
            name: "token",
            value: generateToken(),
            path: "/",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7,
        });
        redirect("/admin");
    } else {
        return false;
    }
}

export async function LogoutAction() {
    const cookie = cookies();
    cookie.set({
        name: "token",
        value: "",
        path: "/",
        sameSite: "strict",
        maxAge: 0,
    });
    redirect("/");
}

export async function SaveArticleAction(article: ArticlePatch) {
    if (!await isUserLoggedIn()) redirect("/login", RedirectType.replace);

    if (!article.id) return false;
    if (article.slug && !article.slug.match(/^[a-z0-9-]+$/)) return false;
    if (article.slug === "new" || article.slug === "index") return false;
    if (article.tags?.some(tag => tag.match(/[\/\\]/))) return false;
    if (article.series?.match(/[\/\\]/)) return false;

    return await patchArticle(article);
}

export async function CreateArticleAction(article: ArticleCreate) {
    if (!await isUserLoggedIn()) redirect("/login", RedirectType.replace);

    if (!article.slug) return false;
    if (!article.slug.match(/^[a-z0-9-]+$/)) return false;
    if (article.slug === "new" || article.slug === "index") return false;
    if (!article.title) return false;
    if (article.tags.some(tag => tag.match(/[\/\\]/))) return false;
    if (article.series.match(/[\/\\]/)) return false;

    return await createArticle(article);
}

export async function DeleteArticleAction(id: string) {
    if (!await isUserLoggedIn()) redirect("/login", RedirectType.replace);

    return await deleteArticle(id);
}

//type ContentType = "image/webp" | "image/png" | "image/jpeg";

const imageDir = config.dir.image;

export async function UploadImageAction(formData: FormData) {
    if (!await isUserLoggedIn()) redirect("/login", RedirectType.replace);
    const fileField = formData.get("file");
    if (!fileField || !(fileField instanceof File)) {
        return "";
    }
    const file = await fileField.arrayBuffer();
    const contentType = fileField.type;

    const sha256 = HASH.sha256(Buffer.from(file));
    let filename = `${sha256}`;
    if (contentType === "image/webp") {
        filename += ".webp";
    } else if (contentType === "image/png") {
        filename += ".png";
    } else if (contentType === "image/jpeg") {
        filename += ".jpg";
    } else {
        return "";
    }
    const filepath = `${imageDir}/${filename}`;
    try {
        // 文件或目录存在
        const stat = await fs.stat(filepath);
        if (stat.isFile()) {
            // 文件存在
            return `/api/image/${filename}`;
        } else {
            // 为目录
            return "";
        }
    } catch (e) {
        // pass
    }
    // 文件不存在, 写入文件
    try {
        await fs.writeFile(filepath, Buffer.from(file));
        return `/api/image/${filename}`;
    } catch (e) {
        return "";
    }
}
