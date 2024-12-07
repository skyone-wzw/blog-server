import {GET as getIcon} from "@/app/favicon/route";
import config from "@/config";
import DefaultCoverImage from "@/default-cover";
import {getDynamicConfig} from "@/lib/config";
import fs from "fs/promises";
import {ImageResponse} from "next/og";
import sharp from "sharp";
import {getFormatter} from "next-intl/server";

const cacheDir = config.dir.cache;
const coverDir = config.dir.cover;
const randomDir = config.dir.random;

async function selectRandomImage() {
    const files = (await fs.readdir(randomDir))
        .filter(file => file.match(/\.(jpe?g|png|webp)$/i));
    if (files.length === 0) return null;
    const index = Math.floor(Math.random() * files.length);
    return `random/${files[index]}`;
}

async function matchImage(id?: string | null) {
    if (!id) return await selectRandomImage();
    const file = `${coverDir}/${id}.png`;
    if (await fs.stat(file).catch(() => false)) return `${id}.png`;
    else return await selectRandomImage();
}

async function getImageDataUrl(id?: string | null) {
    const file = await matchImage(id);
    let buffer;
    if (file) {
        buffer = await fs.readFile(`${coverDir}/${file}`);
    } else {
        buffer = DefaultCoverImage;
    }
    buffer = await sharp(buffer).png().toBuffer();
    return `data:image/png;base64,${buffer.toString("base64")}`;
}

interface ArticleLikeType {
    id: string;
    title: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    slug: string;
}

async function generateCover(article: ArticleLikeType) {
    const cacheFile = `${cacheDir}/${article.slug}-${article.updatedAt.getTime()}.png`;
    if (await fs.stat(cacheFile).catch(() => false)) {
        try {
            return await fs.readFile(cacheFile);
        } catch (e) {
        }
    }

    const coverDataUrl = await getImageDataUrl(article?.id);
    const dynamicConfig = await getDynamicConfig();
    const icon = await getIcon();
    const iconBuffer = await sharp(await icon.arrayBuffer()).png().toBuffer();
    const iconUrl = `data:image/png;base64,${iconBuffer.toString("base64")}`;

    const formatter = await getFormatter();

    const imageResponse = new ImageResponse(
        <div style={{
            display: "flex",
            width: 1300,
            height: 630,
            background: "#ffffff",
        }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={coverDataUrl}
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
                                 borderRadius: "100%",
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
                        }}>{formatter.dateTime(article.createdAt, "default")}</p>
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
        },
    );
    const buffer = Buffer.from(await imageResponse.arrayBuffer());
    await fs.writeFile(cacheFile, buffer);
    return buffer;
}

export default generateCover;
