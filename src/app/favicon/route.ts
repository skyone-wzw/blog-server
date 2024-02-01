import config from "@/config";
import {getDynamicConfig} from "@/lib/config";
import fs from "fs/promises";

function getFileContentTypeFromExtension(ext?: string) {
    if (ext === "webp") {
        return "image/webp";
    } else if (ext === "png") {
        return "image/png";
    } else if (ext === "jpg") {
        return "image/jpeg";
    } else {
        return null;
    }
}

const customImageDir = config.dir.custom;

export async function GET() {
    const dynamicConfig = await getDynamicConfig();

    const logo = dynamicConfig.site.logo;

    const ext = logo.match(/\.(png|webp|jpe?g)$/)?.[1];
    const contentType = getFileContentTypeFromExtension(ext);
    const headers = contentType ? {"Content-Type": contentType} : undefined;

    if (logo.startsWith("/default")) {
        return new Response((await fetch(`http://localhost:3000${logo}`)).body, {headers});
    } else if (await fs.stat(`${customImageDir}/${logo}`).then(stat => !stat.isFile()).catch(() => null)) {
        return new Response((await fetch(`http://localhost:3000/default/logo.png`)).body, {headers: {"Content-Type": "image/png"}});
    }

    return new Response(await fs.readFile(`${customImageDir}/${logo}`), {headers});
}
