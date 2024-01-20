import config from "@/config";
import {cache} from "react";
import sharp from "sharp";

interface ImageMetadata {
    width: number;
    height: number;
}

const ImageMetadataCache = new Map<string, ImageMetadata>();

const imageDir = config.dir.image;

export const getImageMetadata = cache(async (url: string) => {
    const filename = url.match(/^\/api\/image\/([a-fA-F0-9]{64}\.(webp|png|jpe?g))$/i)?.[1];
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
