import config from "@/config";
import {isUserLoggedIn} from "@/lib/auth";
import {HASH} from "@/lib/encrypt";
import fs from "fs/promises";
import {redirect, RedirectType} from "next/navigation";

const imageDir = config.dir.image;
const customImageDir = config.dir.custom;

function getFileExtensionFromContentType(contentType: string) {
    if (contentType === "image/webp") {
        return ".webp";
    } else if (contentType === "image/png") {
        return ".png";
    } else if (contentType === "image/jpeg") {
        return ".jpg";
    } else {
        return null;
    }
}

async function uploadImage(root: string, file: File) {
    const filename = HASH.sha256(Buffer.from(await file.arrayBuffer()));
    const extension = getFileExtensionFromContentType(file.type)
    if (!extension) return null;
    const filepath = `${root}/${filename}`;
    try {
        // 文件或目录存在
        const stat = await fs.stat(filepath);
        if (stat.isFile()) {
            // 文件存在
            return filename;
        } else {
            // 为目录
            return null;
        }
    } catch (e) {
        // pass
    }
    // 文件不存在, 写入文件
    try {
        await fs.writeFile(filepath, Buffer.from(await file.arrayBuffer()));
        return filename;
    } catch (e) {
        return null;
    }
}

export async function UploadImageAction(formData: FormData) {
    if (!await isUserLoggedIn()) redirect("/login", RedirectType.replace);
    const fileField = formData.get("file");
    if (!fileField || !(fileField instanceof File)) {
        return null;
    }
    return await uploadImage(imageDir, fileField);
}

export async function UploadCustomImageAction(formData: FormData) {
    if (!await isUserLoggedIn()) redirect("/login", RedirectType.replace);
    const fileField = formData.get("file");
    if (!fileField || !(fileField instanceof File)) {
        return null;
    }
    return await uploadImage(customImageDir, fileField);
}
