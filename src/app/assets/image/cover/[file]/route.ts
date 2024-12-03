import config from "@/config";
import {isUserLoggedIn} from "@/lib/auth";
import fs from "fs/promises";
import {notFound, redirect, RedirectType} from "next/navigation";

interface ArticleImageProps {
    params: {
        file: string;
    };
}

const imageDir = config.dir.cover;
const randomDir = config.dir.random;

export async function GET(request: Request, {params}: ArticleImageProps) {
    if (!await isUserLoggedIn()) redirect("/login", RedirectType.replace);

    const {file: _file} = await params;
    const file = _file.toLowerCase();
    if (!file || !file.match(/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/) && file !== "random") {
        notFound();
    }

    let filePath = `${imageDir}/${file}.png`;
    if (!await fs.stat(filePath).catch(() => false)) {
        // random image
        const randomCover = await fs.readdir(randomDir);
        const random = randomCover[Math.floor(Math.random() * randomCover.length)];
        filePath = `${randomDir}/${random}`;
    }

    return new Response(
        await fs.readFile(filePath),
        {
            headers: {
                "Content-Type": "image/png",
                "Cache-Control": "public, max-age=0",
            },
        },
    );
}
