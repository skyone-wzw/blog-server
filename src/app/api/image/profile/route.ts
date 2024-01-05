import config from "@/config";
import fs from "fs/promises";
import path from "path";

const profile = config.dir.profile;

async function getFilePath(type: string): Promise<string | null> {
    const files = await fs.readdir(profile);
    const file = files.find((file) => file.startsWith(type) && file.match(/\.(png|jpe?g|webp)$/i));
    return file ? path.join(profile, file) : null;
}

export async function GET(request: Request) {
    const searchParams = new URL(request.url).searchParams;
    const type = searchParams.get("type");
    if (!type) {
        return new Response("Missing type query parameter", {status: 400});
    }
    const filePath = await getFilePath(type);
    if (!filePath) {
        return new Response("File not found", {status: 404});
    }
    let contentType: string;
    if (filePath.endsWith(".png")) {
        contentType = "image/png";
    } else if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg")) {
        contentType = "image/jpeg";
    } else {
        contentType = "image/webp";
    }

    return new Response(
        await fs.readFile(filePath),
        {
            headers: {
                "Content-Type": contentType,
            },
        },
    );
}
