import Paper from "@/components/base/Paper";
import {getAllTags} from "@/lib/article";
import {getDynamicConfig} from "@/lib/config";
import L from "@/lib/links";
import Link from "next/link";

export async function generateMetadata() {
    const dynamicConfig = await getDynamicConfig();
    return {
        title: `全部标签 - ${dynamicConfig.site.title}`,
        description: `${dynamicConfig.site.description} - 所有标签汇总。`,
    };
}

async function TagsPage() {
    const tagsInfo = (await getAllTags())
        .sort((a, b) => a.tag.localeCompare(b.tag));

    return (
        <Paper className="p-6">
            <h2 className="text-text-main text-xl mb-2">所有标签：</h2>
            <div className="space-y-2 p-2">
                {tagsInfo.map(({tag, count}) => (
                    <Link className="flex justify-between text-text-content hover:text-link-hover hover:underline"
                          key={tag} id={`tag-${tag}`} href={L.tags(tag)}>
                        <span>{tag}</span>
                        <span className="text-text-subnote">共 {count} 篇</span>
                    </Link>
                ))}
            </div>
        </Paper>
    );
}

export default TagsPage;
