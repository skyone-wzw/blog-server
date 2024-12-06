import Fediverse from "@/lib/fediverse";

export async function GET(request: Request) {
    return await Fediverse.getPost(request);
}
