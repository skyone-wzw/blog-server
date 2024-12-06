import {getDynamicConfig} from "@/lib/config";
import L from "@/lib/links";
import {getArticleBySlug} from "@/lib/article";
import FediverseUtil from "@/lib/fediverse-utils";

export interface FediverseActivityItem {
    id: string;
    type: "Create";
    actor: string;
    published: string;
    object: FediverseArticleItem;
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
    "@context": string[];
    id: string;
    type: "OrderedCollectionPage";
    partOf: string;
    next?: string;
    prev?: string;
    totalItems: number;
    orderedItems: FediverseActivityItem[];
}

export interface FediverseOrderedCollection {
    "@context": string[];
    id: string;
    type: "OrderedCollection";
    totalItems: number;
    first?: string;
    last?: string;
}

const ext2mime: Record<string, string> = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    webp: "image/webp",
};

const Fediverse = {
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
            icon: {
                type: "Image",
                mediaType: ext2mime[profile.avatar.split(".").pop() ?? "webp"] ?? "image/webp",
                url: `${site.url}${L.image.custom(profile.avatar)}`,
            },
            image: {
                type: "Image",
                mediaType: ext2mime[profile.cover.split(".").pop() ?? "webp"] ?? "image/webp",
                url: `${site.url}${L.image.custom(profile.cover)}`,
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
