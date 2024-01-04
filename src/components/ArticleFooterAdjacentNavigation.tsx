import {getAdjacentArticleMetadata} from "@/lib/article";
import Link from "next/link";

function PrevIcon() {
    return (
        <svg fill="currentColor" viewBox="0 0 256 512" height={24} width={24} xmlns="http://www.w3.org/2000/svg">
            <path
                d="M31.7 239l136-136c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9L127.9 256l96.4 96.4c9.4 9.4 9.4 24.6 0 33.9L201.7 409c-9.4 9.4-24.6 9.4-33.9 0l-136-136c-9.5-9.4-9.5-24.6-.1-34z"></path>
        </svg>
    )
}

function NextIcon() {
    return (
        <svg fill="currentColor" viewBox="0 0 256 512" height={24} width={24} xmlns="http://www.w3.org/2000/svg">
            <path
                d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z"></path>
        </svg>
    )
}

interface ArticleFooterAdjacentNavigationProps {
    slug: string;
}

async function ArticleFooterAdjacentNavigation({slug}: ArticleFooterAdjacentNavigationProps) {
    const adjacent = await getAdjacentArticleMetadata(slug);

    return (
        <div className="grid grid-cols-2 gap-x-6">
            {adjacent.next && (
                <Link href={`/post/${adjacent.next.slug}`} className="col-start-1 bg-bg-light text-text-content hover:text-link-hover rounded-lg shadow p-4 gap-x-2 flex flex-row justify-start items-center">
                    <PrevIcon/>
                    {adjacent.next.title}
                </Link>
            )}
            {adjacent.prev && (
                <Link href={`/post/${adjacent.prev.slug}`} className="col-start-2 bg-bg-light text-text-content hover:text-link-hover rounded-lg shadow p-4 flex flex-row justify-end items-center">
                    {adjacent.prev.title}
                    <NextIcon/>
                </Link>
            )}
        </div>
    )
}

export default ArticleFooterAdjacentNavigation;
