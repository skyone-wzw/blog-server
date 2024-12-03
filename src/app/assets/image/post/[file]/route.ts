import config from "@/config";
import fs from "fs/promises";
import {notFound} from "next/navigation";

interface ArticleImageProps {
    params: {
        file: string;
    };
}

const imageDir = config.dir.image;

export async function GET(request: Request, {params}: ArticleImageProps) {
    const {file} = await params;
    if (!file || !file.match(/^[a-fA-F0-9]{64}\.(webp|png|jpe?g)$/)) {
        notFound();
    }

    let contentType: string;
    if (file.endsWith(".webp")) {
        contentType = "image/webp";
    } else if (file.endsWith(".png")) {
        contentType = "image/png";
    } else if (file.endsWith(".jpg") || file.endsWith(".jpeg")) {
        contentType = "image/jpeg";
    } else {
        notFound();
    }

    if (!await fs.stat(`${imageDir}/${file}`).then(stat => stat.isFile()).catch(() => null)) {
        notFound();
    }

    return new Response(
        await fs.readFile(`${imageDir}/${file}`),
        {
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=31536000",
            },
        },
    );
}
