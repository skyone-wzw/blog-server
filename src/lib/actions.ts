"use server";

import config from "@/config";
import {ArticleCreate, ArticlePatch} from "@/lib/article";
import {generateToken} from "@/lib/auth";
import {HASH} from "@/lib/encrypt";
import prisma from "@/lib/prisma";
import {ObjectOmit} from "@/lib/type-utils";
import fs from "fs/promises";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";

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
        redirect("/");
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
    try {
        await prisma.post.update({
            where: {
                id: article.id,
            },
            data: ObjectOmit(article, ["id"])
        });
        return true;
    } catch (e) {
        return false;
    }
}

export async function CreateArticleAction(article: ArticleCreate) {
    try {
        await prisma.post.create({
            data: article
        });
        return true;
    } catch (e) {
        return false;
    }
}

//type ContentType = "image/webp" | "image/png" | "image/jpeg";

export async function UploadImageAction(formData: FormData) {
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
    const filepath = `${config.imageDir}/${filename}`;
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
