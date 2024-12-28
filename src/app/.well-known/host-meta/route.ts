import {getDynamicConfig} from "@/lib/config";

export async function GET(_: Request) {
    const {site} = await getDynamicConfig();
    return new Response(
        `<?xml version="1.0" encoding="UTF-8"?>`
        + `<XRD xmlns="http://docs.oasis-open.org/ns/xri/xrd-1.0">`
        + `<Link rel="lrdd" type="application/xrd+xml" template="${site.url}/.well-known/webfinger?resource={uri}"/>`
        + `</XRD>`, {
            headers: {
                "Content-Type": "application/xrd+xml",
            },
        });
}
