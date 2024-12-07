import Paper from "@/components/base/Paper";
import {getAllTags} from "@/lib/article";
import {getDynamicConfig} from "@/lib/config";
import L from "@/lib/links";
import Link from "next/link";
import {getTranslations} from "next-intl/server";

export async function generateMetadata() {
    const {site} = await getDynamicConfig();
    const t = await getTranslations("page.tags.metadata-all");
    return {
        title: t("title", {siteName: site.title}),
        description: t("description", {siteName: site.title, siteDescription: site.description}),
    };
}

async function TagsPage() {
    const t = await getTranslations("page.tags");
    const tagsInfo = (await getAllTags())
        .sort((a, b) => a.tag.localeCompare(b.tag));

    return (
        <Paper className="p-6">
            <h2 className="text-text-main text-xl mb-2">{t("all")}</h2>
            <div className="space-y-2 p-2">
                {tagsInfo.map(({tag, count}) => (
                    <Link className="flex justify-between text-text-content hover:text-link-hover hover:underline"
                          key={tag} id={`tag-${tag}`} href={L.tags(tag)}>
                        <span>{t("title", {tag})}</span>
                        <span className="text-text-subnote">{t("count", {count})}</span>
                    </Link>
                ))}
            </div>
        </Paper>
    );
}

export default TagsPage;
