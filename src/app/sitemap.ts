import {DEFAULT_ARTICLE_PER_PAGE, getAllArticlesMetadata} from "@/lib/article";
import {getDynamicConfig} from "@/lib/config";
import L from "@/lib/links";
import {MetadataRoute} from "next";

// url: string;
// lastModified?: string | Date;
// changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
// priority?: number;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const articles = (await getAllArticlesMetadata())
        .sort((a, b) => a.updatedAt > b.updatedAt ? -1 : 1);
    const dynamicConfig = await getDynamicConfig();
    const baseUrl = dynamicConfig.site.url;
    const f = (url: string) => `${baseUrl}${url}`;
    const lastUpdated = articles[0].updatedAt;
    const indexPagination = Math.ceil(articles.length / DEFAULT_ARTICLE_PER_PAGE);

    const maps: MetadataRoute.Sitemap = [
        {
            url: f(L.page()),
            lastModified: lastUpdated,
            changeFrequency: "daily",
            priority: 1,
        },
        {
            url: f(L.page("tags")),
            lastModified: lastUpdated,
            changeFrequency: "weekly",
            priority: 0.7,
        },
        {
            url: f(L.page("series")),
            lastModified: lastUpdated,
            changeFrequency: "weekly",
            priority: 0.7,
        },
        {
            url: f(L.page("archive")),
            lastModified: lastUpdated,
            changeFrequency: "weekly",
            priority: 0.7,
        },
        {
            url: f(L.page("friends")),
            lastModified: lastUpdated,
            changeFrequency: "weekly",
            priority: 0.7,
        },
    ];

    for (let i = 2; i <= indexPagination; i++) {
        maps.push({
            url: f(L.homePagination(i)),
            lastModified: lastUpdated,
            changeFrequency: "daily",
            priority: 0.9,
        });
    }

    articles.forEach((article) => {
        maps.push({
            url: f(L.post(article.slug)),
            lastModified: article.updatedAt,
            changeFrequency: "weekly",
            priority: 0.9,
        });
    });

    return maps;
}
