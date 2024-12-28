import {getNodeInfo} from "@/app/.well-known/nodeinfo/route";

export async function GET(_: Request) {
    return Response.json(await getNodeInfo("2.1"), {
        headers: {
            "Content-Type": "application/json; profile=\"http://nodeinfo.diaspora.software/ns/schema/2.1#\"; charset=utf-8",
        },
    });
}
