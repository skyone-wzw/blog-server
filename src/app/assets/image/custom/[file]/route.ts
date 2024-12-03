import config from "@/config";
import fs from "fs/promises";
import {notFound} from "next/navigation";

interface ArticleImageProps {
    params: {
        file: string;
    };
}

const imageDir = config.dir.custom;

export async function GET(_: Request, {params}: ArticleImageProps) {
    const {file} = await params;

    if (!await fs.stat(`${imageDir}/${file}`).then(stat => stat.isFile()).catch(() => null)) {
        notFound();
    }

    return new Response(await fs.readFile(`${imageDir}/${file}`));
}
