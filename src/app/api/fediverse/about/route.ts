import Fediverse from "@/lib/fediverse";
import {getDynamicConfig} from "@/lib/config";

export async function GET(request: Request) {
    const {fediverse} = await getDynamicConfig();
    if (!fediverse.enabled) return new Response("Not Found", {status: 404});
    return await Fediverse.getAbout(request);
}
