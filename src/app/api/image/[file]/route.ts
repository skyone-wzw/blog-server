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
    const {file} = params;
    if (!file || !file.match(/^[a-fA-F0-9]{64}\.(webp|png|jpe?g)$/)) {
        console.log(2);
        notFound();
    }
    const sha256 = file.split(".")[0];

    if (request.headers.get("If-None-Match") === sha256) {
        return new Response(null, {
            status: 304,
            headers: {
                "E-Tag": sha256,
            },
        });
    }
    // 由于使用 SHA256 作为文件名, 只要文件名不变, 文件内容也不会变, 无需确认文件内容是否变化
    if (request.headers.get("If-Modified-Since")) {
        return new Response(null, {
            status: 304,
            headers: {
                "E-Tag": sha256,
            },
        });
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

    if (await fs.stat(`${imageDir}/${file}`).then(stat => !stat.isFile()).catch(() => null)) {
        notFound();
    }

    return new Response(
        await fs.readFile(`${imageDir}/${file}`),
        {
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=31536000",
                "E-Tag": sha256,
            },
        },
    );
}
