import {getAllArticlesMetadata} from "@/lib/article";
import {getDynamicConfig} from "@/lib/config";
import L from "@/lib/links";
import {Feed} from "feed";

export async function GET() {
    const articles = (await getAllArticlesMetadata())
        .sort((a, b) => a.updatedAt > b.updatedAt ? -1 : 1);
    const dynamicConfig = await getDynamicConfig();
    const baseUrl = dynamicConfig.site.url;
    const f = (url: string) => `${baseUrl}${url}`;
    const lastUpdated = articles[0]?.updatedAt ?? new Date();

    const feed = new Feed({
        id: dynamicConfig.site.url,
        title: dynamicConfig.site.title,
        description: dynamicConfig.site.description,
        link: dynamicConfig.site.url,
        copyright: `Copyright © 2020 - ${new Date().getFullYear()} · ${dynamicConfig.profile.name}`,
        image: f(L.image.custom(dynamicConfig.site.cover)),
        favicon: f(L.page("favicon")),
        updated: lastUpdated,
        generator: "Blog Server",
        feedLinks: {
            atom: f("/atom.xml"),
        },
        author: {
            name: dynamicConfig.profile.name,
            email: dynamicConfig.profile.email,
            link: dynamicConfig.site.url,
        },
    });

    articles.forEach((article) => {
        feed.addItem({
            id: f(L.post(article.slug)),
            title: article.title,
            link: f(L.post(article.slug)),
            description: article.description,
            content: `<p>${article.description}</p><p><a href="${f(L.post(article.slug))}">Read more</a></p>`,
            author: [{
                name: dynamicConfig.profile.name,
                email: dynamicConfig.profile.email,
                link: dynamicConfig.site.url,
            }],
            date: article.createdAt,
            image: f(L.cover(article.slug, article.updatedAt.getTime(), dynamicConfig.site.logo)),
        });
    });

    return new Response(feed.atom1(), {
        headers: {
            "Content-Type": "application/xml",
        },
    });
}
