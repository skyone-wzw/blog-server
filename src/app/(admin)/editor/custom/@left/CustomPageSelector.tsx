"use client";

import Paper from "@/components/base/Paper";
import {CustomPageMetadata} from "@/lib/custom-page";
import L from "@/lib/links";
import clsx from "clsx";
import Link from "next/link";
import {usePathname} from "next/navigation";

interface ArticleClassifierProps {
    className?: string;
    pages: CustomPageMetadata[];
}

function CustomPageSelector({pages, className}: ArticleClassifierProps) {
    const pathname = usePathname();

    const isSelectPage = pathname === L.editor.custom();

    return (
        <aside
            className={clsx("w-full lg:w-80 m-2 flex-col space-y-2", isSelectPage ? "flex" : "hidden lg:flex", className)}>
            <Paper className="py-4 flex-grow h-0">
                <p className="px-4 text-text-subnote text-sm">所有自定义页面</p>
                <div className="px-2.5 divide-y divide-dashed divide-bg-tag max-h-full overflow-auto xc-scroll">
                    <Link href={L.editor.custom("/new")}
                          className="block p-2 text-sm text-text-content justify-between hover:bg-bg-hover">
                        新建页面
                    </Link>
                    {pages.map(page => (
                        <Link className="block p-2 text-sm text-text-content justify-between hover:bg-bg-hover"
                              key={page.slug}
                              href={L.editor.custom(page.slug)}>
                            {page.title}
                        </Link>
                    ))}
                </div>
            </Paper>
        </aside>
    );
}

export default CustomPageSelector;
