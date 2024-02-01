"use server";

import {isUserLoggedIn} from "@/lib/auth";
import {DynamicConfig, getDynamicConfig, ProfileDynamicConfig} from "@/lib/config";
import {uploadCustomImage} from "@/lib/file";
import prisma from "@/lib/prisma";
import {DeepMergeTemplate, DeepPartial} from "@/lib/type-utils";
import {revalidatePath} from "next/cache";
import {redirect, RedirectType} from "next/navigation";

export async function SaveDynamicConfigAction<K extends keyof DynamicConfig>(key: K, value: DynamicConfig[K]) {
    if (!await isUserLoggedIn()) redirect("/login", RedirectType.replace);
    const dynamicConfig = await getDynamicConfig();
    if (!!dynamicConfig[key]) return;

    const data = DeepMergeTemplate(structuredClone(dynamicConfig[key]), value);
    try {
        await prisma.config.upsert({
            where: {key},
            update: {value: JSON.stringify(data)},
            create: {key, value: JSON.stringify(data)},
        });

        revalidatePath("/", "layout");

        return true;
    } catch (e) {
        return false;
    }
}

export interface SaveProfileActionState {
    error: boolean;
    message: string;
    timestamp: number;
}

export async function SaveProfileAction(_prevState: SaveProfileActionState, formData: FormData) {
    if (!await isUserLoggedIn()) redirect("/login", RedirectType.replace);
    const update: DeepPartial<ProfileDynamicConfig> = {};
    const name = formData.get("name");
    const avatar = formData.get("avatar");
    const email = formData.get("email");
    const cover = formData.get("cover");
    const description = formData.get("description");
    const github = formData.get("social-github");
    const zhihu = formData.get("social-zhihu");

    const error = {error: true, message: "未知错误", timestamp: Date.now()};
    const success = {error: false, message: "保存成功", timestamp: Date.now()};

    if (typeof name === "string") {
        update.name = name;
    } else if (!!name) {
        return error;
    }

    if (typeof email === "string") {
        update.email = email;
    } else if (!!email) {
        return error;
    }

    if (typeof description === "string") {
        update.description = description;
    } else if (!!description) {
        return error;
    }

    if (typeof github === "string") {
        update.social ??= {};
        update.social.github = github;
    } else if (!!github) {
        return error;
    }

    if (typeof zhihu === "string") {
        update.social ??= {};
        update.social.zhihu = zhihu;
    } else if (!!zhihu) {
        return error;
    }

    if (!!avatar && !(avatar instanceof File)) {
        return error;
    }
    if (!!cover && !(cover instanceof File)) {
        return error;
    }

    if (avatar instanceof File && avatar.type !== "application/octet-stream") {
        const avatarUrl = await uploadCustomImage(avatar);
        if (!avatarUrl) return {error: true, message: "上传头像失败", timestamp: Date.now()};
        update.avatar = avatarUrl;
    }
    if (cover instanceof File && cover.type !== "application/octet-stream") {
        const coverUrl = await uploadCustomImage(cover);
        if (!coverUrl) return {error: true, message: "上传背景图失败", timestamp: Date.now()};
        update.cover = coverUrl;
    }

    try {
        await prisma.config.upsert({
            where: {key: "profile"},
            update: {value: JSON.stringify(update)},
            create: {key: "profile", value: JSON.stringify(update)},
        });

        revalidatePath("/", "layout");

        return success;
    } catch (e) {
        return error;
    }
}
