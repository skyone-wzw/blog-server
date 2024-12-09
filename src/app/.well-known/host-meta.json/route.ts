import {getDynamicConfig} from "@/lib/config";

export async function GET(_: Request) {
    const {site} = await getDynamicConfig();
    return Response.json({
        links: [
            {
                rel: "lrdd",
                type: "application/jrd+json",
                template: `${site.url}/.well-known/webfinger?resource={uri}`,
            },
        ],
    });
}
