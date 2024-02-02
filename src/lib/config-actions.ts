"use server";

import {isUserLoggedIn} from "@/lib/auth";
import {DynamicConfig, getDynamicConfig, ProfileDynamicConfig, SiteDynamicConfig} from "@/lib/config";
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

export async function UpdateServerUrlAction(url: string) {
    if (!await isUserLoggedIn()) redirect("/login", RedirectType.replace);

    if (!url) return false;

    try {
        const _url = new URL(url);
        const newUrl = `${_url.protocol}//${_url.host}`;
        const dynamicConfig = await getDynamicConfig();
        const siteConfig = dynamicConfig.site;
        siteConfig.url = newUrl;
        await prisma.config.upsert({
            where: {key: "site"},
            update: {value: JSON.stringify(siteConfig)},
            create: {key: "site", value: JSON.stringify(siteConfig)},
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

export async function SaveProfileConfigAction(_prevState: SaveProfileActionState, formData: FormData) {
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

export interface SaveSiteConfigActionState {
    error: boolean;
    message: string;
    timestamp: number;
}

export async function SaveSiteConfigAction(_prevState: SaveSiteConfigActionState, formData: FormData) {
    if (!await isUserLoggedIn()) redirect("/login", RedirectType.replace);
    const update: DeepPartial<SiteDynamicConfig> = {};
    const title = formData.get("title");
    const logo = formData.get("logo");
    const description = formData.get("description");
    const cover = formData.get("cover");
    const keywords = formData.getAll("keywords[]");

    const error = {error: true, message: "未知错误", timestamp: Date.now()};
    const success = {error: false, message: "保存成功", timestamp: Date.now()};

    if (typeof title === "string") {
        update.title = title;
    } else if (!!title) {
        return error;
    }

    if (typeof description === "string") {
        update.description = description;
    } else if (!!description) {
        return error;
    }

    if (Array.isArray(keywords) && keywords.every((k) => typeof k === "string")) {
        update.keywords = (keywords as string[]).filter((k) => k.length > 0);
    } else if (!!keywords) {
        return error;
    }

    if (logo instanceof File && logo.type !== "application/octet-stream") {
        const logoUrl = await uploadCustomImage(logo);
        if (!logoUrl) return {error: true, message: "上传 Logo 失败", timestamp: Date.now()};
        update.logo = logoUrl;
    }

    if (cover instanceof File && cover.type !== "application/octet-stream") {
        const coverUrl = await uploadCustomImage(cover);
        if (!coverUrl) return {error: true, message: "上传封面失败", timestamp: Date.now()};
        update.cover = coverUrl;
    }

    try {
        await prisma.config.upsert({
            where: {key: "site"},
            update: {value: JSON.stringify(update)},
            create: {key: "site", value: JSON.stringify(update)},
        });

        revalidatePath("/", "layout");

        return success;
    } catch (e) {
        return error;
    }
}
