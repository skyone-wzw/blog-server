import {getDynamicConfig} from "@/lib/config";
import {getAllArticleCount} from "@/lib/article";
import {getAllCommentCount} from "@/lib/comment";
import {getLocale} from "next-intl/server";

export async function getNodeInfo(version: string) {
    const {site, profile} = await getDynamicConfig();
    const post = await getAllArticleCount();
    const comment = await getAllCommentCount();
    const locate = await getLocale();
    return {
        "version": version,
        "software": {
            "name": "blog-server",
            "version": "v1.0.1",
            "homepage": "https://github.com/skyone-wzw/blog-server",
        },
        "protocols": [
            "activitypub",
        ],
        "services": {
            "inbound": [],
            "outbound": [
                "atom1.0",
            ],
        },
        "openRegistrations": false,
        "usage": {
            "users": {
                "total": 1,
                "activeHalfyear": 1,
                "activeMonth": 1,
            },
            "localPosts": post,
            "localComments": comment,
        },
        "metadata": {
            "nodeName": site.title,
            "nodeDescription": site.description,
            "nodeAdmins": [
                {
                    "name": profile.name,
                    "email": profile.email,
                },
            ],
            "maintainer": {
                "name": profile.name,
                "email": profile.email,
            },
            "langs": [locate],
            "inquiryUrl": site.url,
            "repositoryUrl": "https://github.com/skyone-wzw/blog-server",
            "feedbackUrl": "https://github.com/skyone-wzw/blog-server/issues/new",
            "disableRegistration": true,
            "disableLocalTimeline": false,
            "disableGlobalTimeline": false,
            "emailRequiredForSignup": true,
            "enableHcaptcha": false,
            "enableRecaptcha": false,
            "enableMcaptcha": false,
            "enableTurnstile": false,
            "maxNoteTextLength": 50000,
            "enableEmail": true,
            "enableServiceWorker": false,
            "proxyAccountName": null,
            "themeColor": "#66ccff",
        },
    };
}

export async function GET(_: Request) {
    const {site} = await getDynamicConfig();
    return Response.json({
        links: [
            {
                rel: "http://nodeinfo.diaspora.software/ns/schema/2.1",
                href: `${site.url}/.well-known/nodeinfo/2.1`,
            },
            {
                rel: "http://nodeinfo.diaspora.software/ns/schema/2.0",
                href: `${site.url}/.well-known/nodeinfo/2.0`,
            },
        ],
    });
}
