import {getDynamicConfig} from "@/lib/config";
import prisma from "@/lib/prisma";
import FediverseUtil from "@/lib/fediverse-utils";
import {PreprocessCommentHtml, PreprocessCommentSource} from "@/components/markdown/server-comment-processor";

async function parseActor(actor: string | any) {
    let profile = actor;
    if (typeof actor === "string") {
        const response = await fetch(actor, {
            headers: {
                "Accept": "application/activity+json",
            },
        });
        if (!response.ok) {
            return undefined;
        }
        profile = await response.json();
    }
    const guest = {
        name: profile.name,
        uid: `${profile.preferredUsername}@${new URL(profile.id).hostname}`,
        url: profile.id,
        webUrl: profile.url,
        summary: profile.summary,
        avatar: profile.icon?.[0]?.url ?? profile.icon?.[0] ?? profile.icon?.url ?? profile.icon,
        banner: profile.image?.[0]?.url ?? profile.image?.[0] ?? profile.image?.url ?? profile.image,
        keyId: profile.publicKey?.[0]?.id ?? profile.publicKey?.id ?? `${profile.id}#main-key`,
        publicKey: profile.publicKey?.[0]?.publicKeyPem ?? profile.publicKey?.[0] ?? profile.publicKey?.publicKeyPem ?? profile.publicKey,
    };
    if (guest.webUrl && typeof guest.webUrl !== "string") return undefined;
    if (typeof guest.url !== "string") return undefined;
    if (typeof profile.preferredUsername !== "string") return undefined;
    if (typeof guest.name !== "string") return undefined;
    if (guest.summary && typeof guest.summary !== "string") return undefined;
    if (guest.avatar && typeof guest.avatar !== "string") return undefined;
    if (guest.banner && typeof guest.banner !== "string") return undefined;
    if (typeof guest.publicKey !== "string") return undefined;
    return guest as {
        name: string,
        uid: string,
        url: string,
        summary?: string,
        webUrl?: string,
        avatar?: string,
        banner?: string,
        keyId: string,
        publicKey: string
    };
}

async function parseNote(note: any) {
    const allowedMediaTypes = ["text/markdown", "text/x.misskeymarkdown"];
    const result = {
        uid: note.id,
        replyTo: note.inReplyTo?.id ?? note.inReplyTo,
        content: note.content,
        source: note.source?.find?.((v: any) => v?.mediaType === "text/markdown")?.content
            ?? note.source?.find?.((v: any) => typeof v === "string")
            ?? (allowedMediaTypes.includes(note.source?.mediaType ?? "") ? note.source?.content : undefined)
            ?? (typeof note.source === "string" ? note.source : undefined),
    };
    if (typeof result.uid !== "string") return undefined;
    if (typeof result.replyTo !== "string") return undefined;
    if (typeof result.content !== "string") return undefined;
    if (result.source && typeof result.source !== "string") return undefined;

    const comment = await prisma.fediverseComment.findUnique({
        where: {
            uid: result.uid,
        },
        select: {
            id: true,
        },
    });
    if (comment) return undefined;

    return result as { uid: string, replyTo: string, content: string, source?: string };
}

async function parseImages(note: any) {
    const images = note.attachment?.filter((v: any) => {
        return v.type === "Document" && v.mediaType.startsWith("image/") && typeof v.url === "string";
    });
    if (!images) return [];
    return images.map((v: any) => {
        return {
            url: v.url,
            mediaType: v.mediaType,
            sensitive: v.sensitive ?? false,
        };
    }) as { url: string, mediaType: string, sensitive: boolean }[];
}

async function parseReply(reply: string): Promise<{ postId?: string, reply?: string }> {
    const {site} = await getDynamicConfig();
    const matches = reply.match(new RegExp(`^${site.url}/post/([a-z0-9-]+)`));
    if (matches) {
        const post = await prisma.post.findUnique({
            where: {
                slug: matches[1],
            },
            select: {
                id: true,
            },
        });
        return {
            postId: post?.id,
            reply: undefined,
        };
    } else {
        const result = await prisma.fediverseComment.findUnique({
            where: {
                uid: reply,
            },
            select: {
                uid: true,
                postId: true,
            },
        });
        if (!result) return {postId: undefined, reply: undefined};
        return {
            postId: result.postId,
            reply: result.uid,
        };
    }
}

export async function POST(request: Request) {
    const {fediverse} = await getDynamicConfig();
    if (!fediverse.enabled) return new Response("Not Found", {status: 404});
    const signature = {
        Date: request.headers.get("Date")!,
        Signature: request.headers.get("Signature")!,
        Digest: request.headers.get("Digest")!,
        Host: request.headers.get("Host")!,
    };
    if (!signature.Date || !signature.Signature || !signature.Digest || !signature.Host) {
        return Response.json({
            code: 400,
            message: "Bad Request",
        }, {
            status: 400,
        });
    }
    if (!await FediverseUtil.verifySignature(request)) {
        return Response.json({
            code: 401,
            message: "Unauthorized",
        }, {
            status: 401,
        });
    }
    try {
        do {
            const activity = await request.json();
            if (activity.type !== "Create") {
                // 暂不支持其他类型的活动
                break;
            }
            const object = activity.object;
            if (object.type === "Note") {
                const actor = activity.actor;
                const guest = await parseActor(actor);
                if (!guest) {
                    break;
                }
                const content = await parseNote(object);
                if (!content) {
                    break;
                }
                const _date = activity.published;
                const date = new Date(_date);
                if (isNaN(date.getTime())) {
                    break;
                }

                const images = await parseImages(object);

                const replyInfo = await parseReply(content.replyTo);
                if (!replyInfo.postId) {
                    break;
                }

                const fediverseGuest = {
                    name: guest.name,
                    uid: guest.uid,
                    url: guest.url,
                    summary: guest.summary
                        ? JSON.stringify(await PreprocessCommentHtml(guest.summary))
                        : undefined,
                    webUrl: guest.webUrl,
                    avatar: guest.avatar,
                    banner: guest.banner,
                    keyId: guest.keyId,
                    publicKey: guest.publicKey,
                };
                const comment = {
                    uid: content.uid,
                    userId: fediverseGuest.uid,
                    content: content.content,
                    source: content.source,
                    parsed: JSON.stringify(content.source
                        ? await PreprocessCommentSource(content.source)
                        : await PreprocessCommentHtml(content.content)),
                    images: JSON.stringify(images),
                    replyTo: replyInfo.reply,
                    postId: replyInfo.postId,
                    createdAt: date,
                    updatedAt: date,
                };
                await prisma.fediverseGuest.upsert({
                    where: {
                        uid: fediverseGuest.uid,
                    },
                    update: fediverseGuest,
                    create: fediverseGuest,
                });
                await prisma.fediverseComment.create({
                    data: comment,
                });
            }
        } while (false);
    } catch (e) {
        console.error(e);
        return Response.json({
            code: 500,
            message: "Internal Server Error",
        }, {
            status: 500,
        });
    }

    return Response.json({
        message: "OK",
    }, {
        status: 200,
    });
}
