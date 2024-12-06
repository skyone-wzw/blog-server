import {getAllArticleCount, getRecentArticlesMetadata} from "@/lib/article";
import {getDynamicConfig} from "@/lib/config";
import L from "@/lib/links";
import {
    FediverseActivityItem,
    FediverseArticleItem,
    FediverseOrderedCollection,
    FediverseOrderedCollectionPage,
} from "@/lib/fediverse";
import FediverseUtil from "@/lib/fediverse-utils";

const FEDIVERSE_OUTBOX_PAGE_SIZE = 10;

export async function GET(request: Request) {
    const url = new URL(request.url);
    const _page = url.searchParams.get("page");
    const {site} = await getDynamicConfig();
    const total = await getAllArticleCount();
    const allPage = Math.ceil(total / FEDIVERSE_OUTBOX_PAGE_SIZE);
    if (total === 0) {
        return Response.json({
            code: 404,
            message: "Cannot find resource",
        }, {
            status: 404,
        });
    }
    if (_page) {
        const page = parseInt(_page);
        if (isNaN(page)) {
            return Response.json({
                code: 400,
                message: "Bad Request",
            }, {
                status: 400,
            });
        }
        if (page < 1 || page > allPage) {
            return Response.json({
                code: 404,
                message: "Cannot find resource",
            }, {
                status: 404,
            });
        }
        const articles = await getRecentArticlesMetadata({
            page, limit: FEDIVERSE_OUTBOX_PAGE_SIZE,
        });
        const items: FediverseArticleItem[] = await Promise.all(articles.map(FediverseUtil.articleToFediverseNode));
        const activityItems: FediverseActivityItem[] = items.map(item => ({
            id: item.id,
            type: "Create",
            actor: `${site.url}${L.fediverse.about()}`,
            published: item.published,
            object: item,
        }));
        const collectionPage: FediverseOrderedCollectionPage = {
            "@context": [
                "https://www.w3.org/ns/activitystreams",
                "https://w3id.org/security/v1",
            ],
            id: `${site.url}${L.fediverse.outbox()}?page=${page}`,
            type: "OrderedCollectionPage",
            partOf: `${site.url}${L.fediverse.outbox()}`,
            next: page < allPage ? `${site.url}${L.fediverse.outbox()}?page=${page + 1}` : undefined,
            prev: page > 1 ? `${site.url}${L.fediverse.outbox()}?page=${page - 1}` : undefined,
            totalItems: total,
            orderedItems: activityItems,
        };
        return Response.json(collectionPage, {
            status: 200,
            headers: {
                "Content-Type": "application/activity+json",
            },
        });
    }
    const collection: FediverseOrderedCollection = {
        "@context": [
            "https://www.w3.org/ns/activitystreams",
            "https://w3id.org/security/v1",
        ],
        id: `${site.url}${L.fediverse.outbox()}`,
        type: "OrderedCollection",
        totalItems: total,
        first: `${site.url}${L.fediverse.outbox()}?page=1`,
        last: `${site.url}${L.fediverse.outbox()}?page=${allPage}`,
    };
    return Response.json(collection, {
        status: 200,
        headers: {
            "Content-Type": "application/activity+json",
        },
    });
}
