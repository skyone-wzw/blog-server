import Paper from "@/components/base/Paper";
import {getAllTags} from "@/lib/article";
import clsx from "clsx";
import Link from "next/link";

interface AsideTagsProps {
    className?: string;
}

async function AsideTags({className}: AsideTagsProps) {
    const allTags = await getAllTags().then(tags =>
        tags.sort((a, b) => b.count - a.count).slice(0, 10));

    return (
        <Paper className={clsx("p-4 text-sm", className)}>
            <p className="mb-3 text-text-subnote">标签</p>
            <div className="p-1.5 flex flex-wrap">
                {allTags.map(tag => (
                    <Link key={tag.tag}
                          className="p-2 text-text-content hover:text-link-hover hover:underline tag-prefix"
                          href={`/tags/${encodeURIComponent(tag.tag)}`}>
                        {tag.tag}
                    </Link>
                ))}
            </div>
        </Paper>
    );
}

export default AsideTags;
