import {getDynamicConfig} from "@/lib/config";
import L from "@/lib/links";
import {ArticleMetadata, getArticleBySlug} from "@/lib/article";
import FediverseUtil from "@/lib/fediverse-utils";
import {PreprocessCommentHtml} from "@/components/markdown/server-comment-processor";
import prisma from "@/lib/prisma";
import {getFollowers, getGuestByUrl} from "@/lib/comment";

export interface FediverseGuestCreate {
    name: string;
    uid: string;
    summary?: string;
    url: string;
    webUrl?: string;
    avatar?: string;
    banner?: string;
    inbox: string;
    outbox: string;
    raw: string;
    keyId: string;
    publicKey: string;
}

export interface FediverseActivityItem {
    id: string;
    type: "Create";
    actor: string;
    published: string;
    object: FediverseArticleItem;
}

type WithContext<T> = T & {
    "@context": string[];
}

export interface FediverseArticleItem {
    id: string;
    type: "Note";
    attributedTo: string;
    inReplyTo: string | null;
    content: string;
    published: string;
    to: string[];
    source: {
        mediaType: string;
        content: string;
    };
}

export interface FediverseOrderedCollectionPage {
    id: string;
    type: "OrderedCollectionPage";
    partOf: string;
    next?: string;
    prev?: string;
    totalItems: number;
    orderedItems: FediverseActivityItem[];
}

export interface FediverseOrderedCollection {
    id: string;
    type: "OrderedCollection";
    totalItems: number;
    first?: string;
    last?: string;
}

export interface FediverseFollow {
    "@context": string[];
    id: string;
    type: "Follow";
    actor: string;
    object: string;
}

export interface FediverseAcceptFollow {
    "@context": string[];
    type: "Accept";
    actor: string;
    object: Omit<FediverseFollow, "@context">;
}

export interface FediverseDeleteArticle {
    type: "Delete";
    actor: string;
    object: {
        id: string;
        type: "Tombstone";
    }
}

export interface FediverseUpdateArticle {
    type: "Update";
    actor: string;
    object: FediverseArticleItem;
}

const ext2mime: Record<string, string> = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    webp: "image/webp",
};

async function waitFor(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function tryFetch(url: string, init?: RequestInit, retry = 3, sleep = 1000): Promise<Response | null> {
    let count = 0;
    while (count < retry) {
        try {
            const result = await fetch(url, init);
            if (result.ok) {
                return result;
            } else {
                console.error(`Failed to fetch ${url}: ${result.status} ${result.statusText}`);
            }
            count++;
        } catch (e) {
            count++;
        }
        await waitFor(sleep);
    }
    return null;
}

async function getRelatedGuest(postId: string): Promise<Record<string, string>> {
    const targets = {} as Record<string, string>;
    (await getFollowers()).forEach(follower => {
        targets[follower.uid] = follower.inbox;
    });
    const comments = await prisma.fediverseComment.findMany({
        where: {
            postId: postId,
        },
        select: {
            user: {
                select: {
                    uid: true,
                    inbox: true,
                },
            },
        },
    });
    comments.forEach(comment => {
        targets[comment.user.uid] = comment.user.inbox;
    });
    return targets;
}

const Fediverse = {
    async fetchActor(actor: string | Record<string, any>): Promise<FediverseGuestCreate | null> {
        let profile: any;
        if (typeof actor === "string") {
            const response = await tryFetch(actor, {
                headers: {
                    "Accept": "application/activity+json",
                },
            });
            if (!response) return null;
            profile = await response.json();
        } else {
            profile = actor;
        }
        const guest = {
            name: profile.name,
            uid: `${profile.preferredUsername}@${new URL(profile.id).hostname}`,
            summary: profile.summary,
            url: profile.id,
            webUrl: profile.url,
            avatar: profile.icon?.[0]?.url ?? profile.icon?.[0] ?? profile.icon?.url ?? profile.icon,
            banner: profile.image?.[0]?.url ?? profile.image?.[0] ?? profile.image?.url ?? profile.image,
            inbox: profile.inbox,
            outbox: profile.outbox,
            raw: JSON.stringify(profile),
            keyId: profile.publicKey?.[0]?.id ?? profile.publicKey?.id ?? `${profile.id}#main-key`,
            publicKey: profile.publicKey?.[0]?.publicKeyPem ?? profile.publicKey?.[0] ?? profile.publicKey?.publicKeyPem ?? profile.publicKey,
        };
        if (guest.webUrl && typeof guest.webUrl !== "string") return null;
        if (typeof guest.url !== "string") return null;
        if (typeof profile.preferredUsername !== "string") return null;
        if (typeof guest.name !== "string") return null;
        if (guest.summary && typeof guest.summary !== "string") return null;
        if (guest.avatar && typeof guest.avatar !== "string") return null;
        if (guest.banner && typeof guest.banner !== "string") return null;
        if (typeof guest.publicKey !== "string") return null;
        guest.summary = guest.summary
            ? JSON.stringify(await PreprocessCommentHtml(guest.summary))
            : undefined;

        await prisma.fediverseGuest.upsert({
            where: {
                uid: guest.uid,
            },
            update: guest,
            create: guest,
        });

        return guest;
    },

    async getActor(actor: string) {
        return await getGuestByUrl(actor);
    },

    async acceptFollow(actor: string, inbox: string, uid: string) {
        const {site, fediverse} = await getDynamicConfig();
        const activity: FediverseAcceptFollow = {
            "@context": [
                "https://www.w3.org/ns/activitystreams",
            ],
            type: "Accept",
            actor: `${site.url}${L.fediverse.about()}`,
            object: {
                id: actor,
                type: "Follow",
                actor: actor,
                object: `${site.url}${L.fediverse.about()}`,
            },
        };
        const signature = await FediverseUtil.calculateSignature(
            fediverse.privateKey,
            JSON.stringify(activity),
            inbox,
        );
        const response = await tryFetch(inbox, {
            method: "POST",
            body: JSON.stringify(activity),
            headers: {
                "Content-Type": "application/activity+json",
                ...signature,
            },
        }, 3, 100);
        if (!!response) {
            await prisma.fediverseGuest.update({
                where: {
                    uid: uid,
                },
                data: {
                    follow: true,
                },
            });
        }
    },

    async broadcastArticle(article: ArticleMetadata) {
        const {site, fediverse} = await getDynamicConfig();
        const followers = await getFollowers();
        const note = await FediverseUtil.articleToFediverseNode(article);
        const activity: WithContext<FediverseActivityItem> = {
            "@context": [
                "https://www.w3.org/ns/activitystreams",
            ],
            id: `${site.url}${L.post(article.slug)}`,
            type: "Create",
            actor: `${site.url}${L.fediverse.about()}`,
            published: article.createdAt.toISOString(),
            object: note,
        };
        for (const follower of followers) {
            const signature = await FediverseUtil.calculateSignature(
                fediverse.privateKey,
                JSON.stringify(activity),
                follower.inbox,
            );
            await tryFetch(follower.inbox, {
                method: "POST",
                body: JSON.stringify(activity),
                headers: {
                    "Content-Type": "application/activity+json",
                    ...signature,
                },
            });
        }
    },

    async deleteArticle(article: ArticleMetadata) {
        const {site, fediverse} = await getDynamicConfig();
        const targets = await getRelatedGuest(article.id);
        const activity: WithContext<FediverseDeleteArticle> = {
            "@context": [
                "https://www.w3.org/ns/activitystreams",
            ],
            type: "Delete",
            actor: `${site.url}${L.fediverse.about()}`,
            object: {
                id: `${site.url}${L.post(article.slug)}`,
                type: "Tombstone",
            },
        }
        for (const uid in targets) {
            const signature = await FediverseUtil.calculateSignature(
                fediverse.privateKey,
                JSON.stringify(activity),
                targets[uid],
            );
            await tryFetch(targets[uid], {
                method: "POST",
                body: JSON.stringify(activity),
                headers: {
                    "Content-Type": "application/activity+json",
                    ...signature,
                },
            });
        }
    },

    async updateArticle(article: ArticleMetadata) {
        const {site, fediverse} = await getDynamicConfig();
        const targets = await getRelatedGuest(article.id);
        const note = await FediverseUtil.articleToFediverseNode(article);
        const activity: WithContext<FediverseUpdateArticle> = {
            "@context": [
                "https://www.w3.org/ns/activitystreams",
            ],
            type: "Update",
            actor: `${site.url}${L.fediverse.about()}`,
            object: note,
        }
        for (const uid in targets) {
            const signature = await FediverseUtil.calculateSignature(
                fediverse.privateKey,
                JSON.stringify(activity),
                targets[uid],
            );
            await tryFetch(targets[uid], {
                method: "POST",
                body: JSON.stringify(activity),
                headers: {
                    "Content-Type": "application/activity+json",
                    ...signature,
                },
            });
        }
    },

    async getAbout(request: Request) {
        if (!request.headers.get("Accept")?.includes("application/activity+json")) {
            return Response.json({
                code: 406,
                message: "Not Acceptable",
            }, {
                status: 406,
            });
        }

        const {site, profile, fediverse} = await getDynamicConfig();

        if (!fediverse.enabled || fediverse.publicKey === "" || fediverse.privateKey === "") {
            // fediverse is not enabled or not configured
            return Response.json({
                code: 404,
                message: "Cannot find resource",
            }, {
                status: 404,
            });
        }

        return Response.json({
            "@context": [
                "https://www.w3.org/ns/activitystreams",
                "https://w3id.org/security/v1",
            ],
            id: `${site.url}${L.fediverse.about()}`,
            type: "Person",
            name: fediverse.name ?? profile.name,
            preferredUsername: fediverse.preferredUsername,
            summary: fediverse.summary ?? profile.description,
            inbox: `${site.url}${L.fediverse.inbox()}`,
            outbox: `${site.url}${L.fediverse.outbox()}`,
            followers: `${site.url}${L.fediverse.followers()}`,
            following: `${site.url}${L.fediverse.following()}`,
            sharedInbox: `${site.url}${L.fediverse.inbox()}`,
            icon: {
                type: "Image",
                mediaType: ext2mime[profile.avatar.split(".").pop() ?? "webp"] ?? "image/webp",
                url: `${site.url}${L.image.custom(profile.avatar)}`,
                sensitive: false,
            },
            image: {
                type: "Image",
                mediaType: ext2mime[profile.cover.split(".").pop() ?? "webp"] ?? "image/webp",
                url: `${site.url}${L.image.custom(profile.cover)}`,
                sensitive: false,
            },
            publicKey: {
                id: `${site.url}${L.fediverse.about()}#main-key`,
                owner: `${site.url}${L.fediverse.about()}`,
                publicKeyPem: `${fediverse.publicKey}`,
            },
        }, {
            status: 200,
            headers: {
                "Content-Type": "application/activity+json",
            },
        });
    },

    async getPost(request: Request) {
        const url = new URL(request.url);
        const path = url.pathname;
        const slug = path.match(/^\/post\/([a-z0-9-]+)$/)?.[1];
        if (!slug) {
            return Response.json({
                code: 404,
                message: "Cannot find resource",
            }, {
                status: 404,
            });
        }
        const article = await getArticleBySlug(slug);
        if (!article) {
            return Response.json({
                code: 404,
                message: "Cannot find resource",
            }, {
                status: 404,
            });
        }
        const item: FediverseArticleItem = await FediverseUtil.articleToFediverseNode(article);
        return Response.json({
            "@context": [
                "https://www.w3.org/ns/activitystreams",
                "https://w3id.org/security/v1",
            ],
            ...item,
        }, {
            status: 200,
            headers: {
                "Content-Type": "application/activity+json",
            },
        });
    },
};

export default Fediverse;
