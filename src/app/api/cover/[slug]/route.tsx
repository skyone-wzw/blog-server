import {GET as getIcon} from "@/app/favicon/route";
import config from "@/config";
import {getArticleMetadataBySlug} from "@/lib/article";
import {getDynamicConfig} from "@/lib/config";
import fs from "fs/promises";
import {ImageResponse} from "next/og";
import sharp from "sharp";

const coverDir = config.dir.cover;
const randomDir = config.dir.random;

async function selectRandomImage() {
    const files = (await fs.readdir(randomDir))
        .filter(file => file.match(/\.(jpe?g|png|webp)$/i));
    if (files.length === 0) return null;
    const index = Math.floor(Math.random() * files.length);
    return `random/${files[index]}`;
}

async function matchImage(slug?: string | null) {
    if (!slug) return await selectRandomImage();
    const files = (await fs.readdir(coverDir))
        .filter(file => file.match(/\.(jpe?g|png|webp)$/i) && file.startsWith(slug));
    if (files.length === 0) return await selectRandomImage();
    const index = Math.floor(Math.random() * files.length);
    return files[index];
}

async function getImageDataUrl(slug?: string | null) {
    const file = await matchImage(slug);
    if (!file) return null;
    let type;
    if (file.endsWith(".webp")) {
        type = "image/webp";
    } else if (file.endsWith(".png")) {
        type = "image/png";
    } else {
        type = "image/jpeg";
    }
    const buffer = await fs.readFile(`${coverDir}/${file}`);
    return `data:${type};base64,${buffer.toString("base64")}`;
}

function formatDate(date: Date) {
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
}

export const revalidate = false;

interface ArticleCoverProps {
    params: {
        slug: string;
    };
}

export async function GET(_: Request, {params}: ArticleCoverProps) {
    const {slug} = params;
    const article = await getArticleMetadataBySlug(slug);
    const dataUrl = await getImageDataUrl(slug);
    if (!article || !dataUrl) {
        return new Response("Not Found", {status: 404});
    }
    const dynamicConfig = await getDynamicConfig();
    const icon = await getIcon();
    const iconBuffer = await sharp(await icon.arrayBuffer()).png().toBuffer();
    const iconUrl = `data:image/png;base64,${iconBuffer.toString("base64")}`;
    return new ImageResponse(
        <div style={{
            display: "flex",
            width: 1300,
            height: 630,
            background: "#ffffff",
        }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={dataUrl}
                 alt="cover"
                 height={630}
                 width={1300}
                 style={{
                     position: "absolute",
                     top: 0,
                     left: 0,
                     width: 1300,
                     height: 630,
                     objectFit: "cover",
                 }}/>
            <div style={{
                display: "flex",
                position: "absolute",
                top: 115,
                left: 170,
                width: 960,
                height: 400,
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                background: "#ffffffDD",
                overflow: "hidden",
                borderRadius: 12,
            }}>
                <div style={{
                    maxWidth: 860,
                    fontSize: 36,
                    color: "#475c6e",
                    height: 108,
                    overflow: "hidden",
                }}>{article.title}</div>
                <div style={{display: "flex", width: 860, flexDirection: "row", padding: 20, overflow: "hidden"}}>
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "nowrap",
                        justifyContent: "flex-start",
                        alignItems: "flex-end",
                    }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={iconUrl}
                             alt="cover"
                             height={36}
                             width={36}
                             style={{
                                 width: 36,
                                 height: 36,
                                 objectFit: "cover",
                             }}/>
                        <p style={{
                            marginBlock: 0,
                            fontSize: 24,
                            padding: 0,
                            marginTop: 0,
                            marginBottom: 0,
                            marginLeft: 10,
                            marginRight: 0,
                            color: "#37475b",
                        }}>{dynamicConfig.site.title}</p>
                        <p style={{
                            marginBlock: 0,
                            fontSize: 20,
                            padding: 0,
                            marginTop: 0,
                            marginBottom: 0,
                            marginLeft: 20,
                            marginRight: 0,
                            color: "#64778b",
                        }}>{formatDate(article.createdAt)}</p>
                    </div>
                </div>
                <div style={{width: 860, fontSize: 24, color: "#64778b", height: 108, overflow: "hidden"}}>
                    {article.description}
                </div>
            </div>
        </div>,
        {
            width: 1300,
            height: 630,
            headers: {
                "Cache-Control": "public, max-age=86400",
            },
        },
    );
}
