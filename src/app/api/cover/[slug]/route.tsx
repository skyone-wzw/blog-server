import generateCover from "@/app/api/cover/[slug]/generate-cover";
import {getArticleMetadataBySlug} from "@/lib/article";

interface ArticleCoverProps {
    params: {
        slug: string;
    };
}

export async function GET(_: Request, {params}: ArticleCoverProps) {
    const {slug} = params;
    const article = await getArticleMetadataBySlug(slug);
    if (!article) return new Response("Not Found", {status: 404});
    const cover = await generateCover(article);
    return new Response(cover, {
        headers: {
            "Content-Type": "image/png",
            "Cache-Control": "public, max-age=86400",
        },
    });
}
