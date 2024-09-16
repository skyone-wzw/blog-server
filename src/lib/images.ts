import config from "@/config";
import fs from "fs/promises";
import {cache} from "react";
import sharp from "sharp";

interface ImageMetadata {
    width: number;
    height: number;
}

const ImageMetadataCache = new Map<string, ImageMetadata>();

const imageDir = config.dir.image;

export const getImageMetadata = cache(async (url: string) => {
    if (url.startsWith("/assets/image/post/")) {
        url = url.slice("/assets/image/post/".length);
    }
    const filename = url.match(/^([a-fA-F0-9]{64}\.(webp|png|jpe?g))$/i)?.[1];
    if (!filename) return null;
    if (ImageMetadataCache.has(filename)) return ImageMetadataCache.get(filename);

    try {
        const {height, width} = await sharp(`${imageDir}/${filename}`).metadata();
        if (typeof height !== "number" || typeof width !== "number") return null;
        const metadata = {height, width};
        ImageMetadataCache.set(filename, metadata);
        return metadata;
    } catch (e) {
        return null;
    }
});

interface ImageWithMetadata {
    name: string;
    metadata: ImageMetadata;
}

export const getAllPostImagesMetadata = cache(async () => {
    const files = (await fs.readdir(imageDir))
        .filter(file => file.match(/^[a-fA-F0-9]{64}\.(webp|png|jpe?g)$/i));
    const metadata: ImageWithMetadata[] = [];
    for (const file of files) {
        const m = await getImageMetadata(file);
        if (m) metadata.push({name: file, metadata: m});
    }
    return metadata;
});
