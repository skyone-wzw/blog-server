"use server";

import {PreprocessArticleContent} from "@/components/markdown/server-content-processor";
import {PreprocessArticleTitle} from "@/components/markdown/title-processor";
import config from "@/config";
import {ArticleCreate, ArticlePatch, createArticle, deleteArticle, patchArticle} from "@/lib/article";
import {generateToken, isUserLoggedIn} from "@/lib/auth";
import {uploadCoverImage} from "@/lib/file";
import L from "@/lib/links";
import {revalidatePath} from "next/cache";
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

    const result = await patchArticle(article);

    if (result) {
        await PreprocessArticleContent(result).catch(() => {});
        await PreprocessArticleTitle(result).catch(() => {});
        revalidatePath(L.editor.post(), "layout");
        revalidatePath(L.post(result.slug), "page");
        return true;
    } else {
        return false;
    }
}

export async function CreateArticleAction(article: ArticleCreate) {
    if (!await isUserLoggedIn()) redirect("/login", RedirectType.replace);

    if (!article.slug) return false;
    if (!article.slug.match(/^[a-z0-9-]+$/)) return false;
    if (article.slug === "new" || article.slug === "index") return false;
    if (!article.title) return false;
    if (article.tags.some(tag => tag.match(/[\/\\]/))) return false;
    if (article.series.match(/[\/\\]/)) return false;

    const result = await createArticle(article);

    if (result) {
        await PreprocessArticleContent(result).catch(() => {});
        await PreprocessArticleTitle(result).catch(() => {});
        revalidatePath(L.editor.post(), "layout");
        return true;
    } else {
        return false;
    }
}

export async function DeleteArticleAction(id: string) {
    if (!await isUserLoggedIn()) redirect("/login", RedirectType.replace);

    const result = await deleteArticle(id);

    if (result) {
        revalidatePath(L.editor.post(), "layout");
        revalidatePath(L.post(result.slug), "page");
        return true;
    } else {
        return false;
    }
}

export async function UploadCoverAction(_prevState: string, form: FormData) {
    if (!await isUserLoggedIn()) redirect("/login", RedirectType.replace);

    const id = form.get("id");
    const slug = form.get("slug");
    const cover = form.get("cover");

    if (!id || !slug || !cover) return "";
    if (!(typeof id === "string") || !(typeof slug === "string") || !(cover instanceof File)) return "";
    if (!id.match(/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/)) return "";
    if (cover.type === "application/octet-stream") return "";

    await uploadCoverImage(cover, id).catch(() => {});
    revalidatePath(L.editor.post(slug), "layout");
    revalidatePath(L.image.cover(slug), "layout");

    return "";
}
