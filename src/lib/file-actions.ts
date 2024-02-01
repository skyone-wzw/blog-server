"use server";

import {isUserLoggedIn} from "@/lib/auth";
import {uploadCustomImage, uploadPostImage} from "@/lib/file";
import {redirect, RedirectType} from "next/navigation";


export async function UploadImageAction(formData: FormData) {
    if (!await isUserLoggedIn()) redirect("/login", RedirectType.replace);
    const fileField = formData.get("file");
    if (!fileField || !(fileField instanceof File)) {
        return null;
    }
    return await uploadPostImage(fileField);
}

export async function UploadCustomImageAction(formData: FormData) {
    if (!await isUserLoggedIn()) redirect("/login", RedirectType.replace);
    const fileField = formData.get("file");
    if (!fileField || !(fileField instanceof File)) {
        return null;
    }
    return await uploadCustomImage(fileField);
}
