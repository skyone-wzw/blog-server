import config from "@/config";
import fs from "fs/promises";
import path from "path";

const coverDir = config.dir.cover;
const randomDir = config.dir.random;

async function selectRandomImage() {
    const files = (await fs.readdir(randomDir))
        .filter(file => file.match(/\.(jpe?g|png|webp)$/i));
    if (files.length === 0) return null;
    const index = Math.floor(Math.random() * files.length);
    return files[index];
}

async function matchImage(slug?: string | null) {
    if (!slug) return await selectRandomImage();
    const files = (await fs.readdir(coverDir))
        .filter(file => file.match(/\.(jpe?g|png|webp)$/i) && file.startsWith(slug));
    if (files.length === 0) return await selectRandomImage();
    const index = Math.floor(Math.random() * files.length);
    return files[index];
}

export async function GET(request: Request) {
    const searchParams = new URL(request.url).searchParams;
    const slug = searchParams.get("slug");
    const image = await matchImage(slug);
    if (!image) return new Response(null, {status: 404});
    const filePath = path.resolve(randomDir, image);
    let contentType;
    if (image.endsWith(".png")) contentType = "image/png";
    else if (image.endsWith(".webp")) contentType = "image/webp";
    else contentType = "image/jpeg";

    return new Response(
        await fs.readFile(filePath),
        {
            headers: {
                "Content-Type": contentType,
            },
        },
    );
}
