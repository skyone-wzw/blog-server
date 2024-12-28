import {getDynamicConfig} from "@/lib/config";
import prisma from "@/lib/prisma";
import FediverseUtil from "@/lib/fediverse-utils";
import {PreprocessCommentHtml, PreprocessCommentSource} from "@/components/markdown/server-comment-processor";
import Fediverse from "@/lib/fediverse";
import L from "@/lib/links";

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

const handlers: Record<string, (activity: any) => Promise<void>> = {
    "Create": async (activity: any) => {
        const object = activity.object;
        if (object.type === "Note") {
            const actor = activity.actor;
            const guest = await Fediverse.fetchActor(actor);
            if (!guest) return;
            const content = await parseNote(object);
            if (!content) return;
            const _date = activity.published;
            const date = new Date(_date);
            if (isNaN(date.getTime())) return;
            const images = await parseImages(object);
            const replyInfo = await parseReply(content.replyTo);
            if (!replyInfo.postId) return;

            const comment = {
                uid: content.uid,
                userId: guest.uid,
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
            await prisma.fediverseComment.create({
                data: comment,
            });
        }
    },
    "Follow": async (activity: any) => {
        const {site} = await getDynamicConfig();
        const actor = activity.actor?.id ?? activity.actor;
        const target = activity.object?.id ?? activity.object;
        if (typeof actor !== "string" || typeof target !== "string") return;
        if (target !== `${site.url}${L.fediverse.about()}`) return;
        // 理论上此处由于经过签名验证, actor 一定是存在的
        const guest = await Fediverse.getActor(actor) ?? await Fediverse.fetchActor(actor);
        if (!guest) return;
        // 响应后再发送回复
        setTimeout(() => Fediverse.acceptFollow(actor, guest.inbox, guest.uid), 100);
    },
    "Undo": async (activity: any) => {
        const object = activity.object;
        if (object.type === "Follow") {
            const actor = activity.actor;
            const target = object.object;
            if (typeof actor !== "string" || typeof target !== "string") return;
            const guest = await Fediverse.getActor(actor) ?? await Fediverse.fetchActor(actor);
            if (!guest) return;
            await prisma.fediverseGuest.update({
                where: {
                    uid: guest.uid,
                },
                data: {
                    follow: false,
                },
            });
        }
    },
    "Delete": async (activity: any) => {
        const actor = activity.actor?.id ?? activity.actor;
        const object = activity.object?.id ?? activity.object;
        if (typeof actor !== "string" || typeof object !== "string") return;
        const guest = await Fediverse.getActor(actor) ?? await Fediverse.fetchActor(actor);
        if (!guest) return;
        await prisma.fediverseComment.updateMany({
            where: {
                userId: guest.uid,
                uid: object,
            },
            data: {
                isHidden: true,
            },
        });
    },
};

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
        const activity = await request.json();
        console.log(`ActivityPub: type=${activity?.type}, actor=${activity?.actor?.id ?? activity.actor}, object=${activity?.object?.id}`);
        if (typeof activity?.type !== "string") {
            return Response.json({
                code: 400,
                message: "Bad Request",
            }, {
                status: 400,
            });
        }
        // 执行处理
        await handlers[activity.type as string]?.(activity);
    } catch (e) {
        console.error(e);
        return Response.json({
            code: 500,
            message: "Internal Server Error",
        }, {
            status: 500,
        });
    }

    return new Response(null, {status: 202});
}
