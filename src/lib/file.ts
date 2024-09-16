import config from "@/config";
import {HASH} from "@/lib/encrypt";
import fs from "fs/promises";

const imageDir = config.dir.image;
const customImageDir = config.dir.custom;

function getFileExtensionFromContentType(contentType: string) {
    if (contentType === "image/webp") {
        return "webp";
    } else if (contentType === "image/png") {
        return "png";
    } else if (contentType === "image/jpeg") {
        return "jpg";
    } else {
        return null;
    }
}

export async function uploadImage(root: string, file: File) {
    const filename = HASH.sha256(Buffer.from(await file.arrayBuffer()));
    const extension = getFileExtensionFromContentType(file.type);
    if (!extension) return null;
    const filepath = `${root}/${filename}.${extension}`;
    const fileUrl = `${filename}.${extension}`;
    try {
        // 文件或目录存在
        const stat = await fs.stat(filepath);
        if (stat.isFile()) {
            // 文件存在
            return fileUrl;
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
        return fileUrl;
    } catch (e) {
        return null;
    }
}

export async function uploadPostImage(file: File) {
    return await uploadImage(imageDir, file);
}

export async function uploadCustomImage(file: File) {
    return await uploadImage(customImageDir, file);
}
