"use server";

import {isUserLoggedIn} from "@/lib/auth";
import {DynamicConfig, getDynamicConfig} from "@/lib/config";
import prisma from "@/lib/prisma";
import {DeepMergeTemplate} from "@/lib/type-utils";
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
