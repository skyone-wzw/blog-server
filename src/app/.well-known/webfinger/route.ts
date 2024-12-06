import {getDynamicConfig} from "@/lib/config";
import L from "@/lib/links";

export async function GET(request: Request) {
    const url = new URL(request.url);
    const resource = url.searchParams.get("resource");
    if (!resource) {
        return Response.json({
            code: 400,
            message: "Bad request",
        }, {
            status: 400,
        });
    }

    const dynamicConfig = await getDynamicConfig();
    const siteUrl = new URL(dynamicConfig.site.url);
    const UserIdRegexp = new RegExp(`^acct:(?<userId>[a-zA-Z-_]+)@${siteUrl.hostname.replace(/\./g, "\\.")}$`);
    const userId = UserIdRegexp.exec(resource)?.groups?.userId;

    if (!dynamicConfig.fediverse.enabled) {
        return Response.json({
            code: 404,
            message: "Not found",
        }, {
            status: 404,
        });
    }

    if (!userId) { // TODO: Check userid
        return Response.json({
            code: 404,
            message: "Cannot find resource",
        }, {
            status: 404,
        });
    }

    return new Response(JSON.stringify({
        subject: resource,
        links: [
            {
                rel: "self",
                type: "application/activity+json",
                href: `${dynamicConfig.site.url}${L.fediverse.about()}`,
            },
        ],
    }), {
        status: 200,
        headers: {
            "Content-Type": "application/jrd+json",
        },
    });
}
