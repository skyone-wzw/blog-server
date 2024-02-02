"use server";

import {isUserLoggedIn} from "@/lib/auth";
import {
    createCustomPage,
    CustomPageCreate,
    CustomPagePatch,
    CustomPageReservedPrefixRegex,
    deleteCustomPage,
    patchCustomPage,
} from "@/lib/custom-page";
import L from "@/lib/links";
import {revalidatePath} from "next/cache";
import {redirect, RedirectType} from "next/navigation";

export async function SaveCustomPageAction(page: CustomPagePatch) {
    if (!await isUserLoggedIn()) redirect("/login", RedirectType.replace);

    if (!page.id) return false;
    if (page.slug && !page.slug.match(/^(?:\/[a-z0-9-]+)+$/)) return false;
    if (page.slug && page.slug.match(CustomPageReservedPrefixRegex)) return false;

    const result = await patchCustomPage(page);

    if (result) {
        revalidatePath(L.editor.custom(), "layout");
        revalidatePath(L.page(result.slug), "page");
        return true;
    } else {
        return false;
    }
}

export async function CreateCustomPageAction(page: CustomPageCreate) {
    if (!await isUserLoggedIn()) redirect("/login", RedirectType.replace);

    if (!page.slug) return false;
    if (!page.slug.match(/^(?:\/[a-z0-9-]+)+$/)) return false;
    if (page.slug.match(CustomPageReservedPrefixRegex)) return false;

    const result = await createCustomPage(page);

    if (result) {
        revalidatePath(L.editor.custom(), "layout");
        return true;
    } else {
        return false;
    }
}

export async function DeleteCustomPageAction(slug: string) {
    if (!await isUserLoggedIn()) redirect("/login", RedirectType.replace);

    const result = await deleteCustomPage(slug);

    if (result) {
        revalidatePath(L.editor.custom(), "layout");
        return true;
    } else {
        return false;
    }
}
