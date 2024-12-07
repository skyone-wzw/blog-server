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

async function Icon() {
    const dynamicConfig = await getDynamicConfig();

    const logo = dynamicConfig.site.logo;

    const ext = logo.match(/\.(png|webp|jpe?g)$/)?.[1];
    const contentType = getFileContentTypeFromExtension(ext);
    const headers = contentType ? {
        "Content-Type": contentType,
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "public, max-age=86400",
    } : {
        "Content-Type": "image/png",
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "public, max-age=86400",
    };

    if (logo.startsWith("/default")) {
        return new Response((await fetch(`http://localhost:3000${logo}`)).body, {headers});
    } else if (await fs.stat(`${customImageDir}/${logo}`).then(stat => !stat.isFile()).catch(() => null)) {
        return new Response((await fetch(`http://localhost:3000/default/logo.png`)).body, {headers});
    }

    return new Response(await fs.readFile(`${customImageDir}/${logo}`), {headers});
}

export default Icon;
