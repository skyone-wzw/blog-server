"use client";

import Paper from "@/components/base/Paper";
import {ArticleMetadata} from "@/lib/article";
import clsx from "clsx";
import Link from "next/link";
import {useEffect, useRef, useState} from "react";

interface SelectedState {
    type: "tag" | "series" | "year" | "all";
    value: string;
}

interface DropdownSelectorProps {
    all: {
        tags: string[];
        series: string[];
        years: string[];
    },
    selected: SelectedState;
    setSelection: (selected: SelectedState) => void;
}

function DropdownSelector({all, selected, setSelection}: DropdownSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && rootRef.current) {
            const listener = () => {
                setIsOpen(false);
            };
            document.addEventListener("click", listener);
            return () => document.removeEventListener("click", listener);
        }
    }, [isOpen, rootRef]);

    const toggle = () => setIsOpen(prev => !prev);

    return (
        <div className="relative inline-block text-left" ref={rootRef}>
            <div>
                <button type="button" onClick={toggle}
                        className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-button-bg px-3 py-2 text-sm text-button-text shadow-sm hover:bg-button-hover"
                        id="menu-button" aria-expanded="true" aria-haspopup="true">
                    过滤
                    <svg className="-mr-1 h-5 w-5" viewBox="0 0 20 20" fill="currentColor"
                         aria-hidden="true">
                        <path fillRule="evenodd"
                              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                              clipRule="evenodd"/>
                    </svg>
                </button>
            </div>

            <div
                className={clsx("absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-bg-light shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none", isOpen ? "block" : "hidden")}
                role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex={-1}>
                <div className="py-1 text-text-content overflow-y-auto xc-scroll article-dropdown-selector" role="none">
                    <button className="block text-start w-full px-4 py-2 text-sm hover:bg-bg-hover"
                            onClick={() => setSelection({type: "all", value: ""})}>
                        全部文章
                    </button>
                    <p className="px-2 py-1 text-text-subnote text-sm">按系列分类:</p>
                    {all.series.map(series => (
                        <button key={series} className={clsx("block text-start w-full px-4 py-2 text-sm hover:bg-bg-hover", selected.value === series && "bg-bg-hover")}
                                onClick={() => setSelection({type: "series", value: series})}>
                            {series}
                        </button>
                    ))}
                    <p className="px-2 py-1 text-text-subnote text-sm">按标签分类:</p>
                    {all.tags.map(tag => (
                        <button key={tag} className="block text-start w-full px-4 py-2 text-sm hover:bg-bg-hover"
                                onClick={() => setSelection({type: "tag", value: tag})}>
                            {tag}
                        </button>
                    ))}
                    <p className="px-2 py-1 text-text-subnote text-sm">按年份分类:</p>
                    {all.years.map(year => (
                        <button key={year} className="block text-start w-full px-4 py-2 text-sm hover:bg-bg-hover"
                                onClick={() => setSelection({type: "year", value: year})}>
                            {year}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

interface ArticleClassifierProps {
    className?: string;
    articles: ArticleMetadata[];
}

function ArticleClassifier({articles, className}: ArticleClassifierProps) {
    const [selected, setSelected] = useState<SelectedState>({type: "all", value: ""});

    const tags = Array.from(new Set(articles.flatMap(article => article.tags))).sort();
    const series = Array.from(new Set(articles.map(article => article.series))).sort();
    const years = Array.from(new Set(articles.map(article => article.createdAt.getFullYear().toString()))).sort();

    const selectedLabel = selected.type === "all" ? "全部文章" :
        selected.type === "tag" ? `标签: ${selected.value}` :
            selected.type === "series" ? `系列: ${selected.value}` :
                `年份: ${selected.value}`;

    const filteredArticles = articles.filter(article => {
        if (selected.type === "all") return true;
        if (selected.type === "tag") return article.tags.includes(selected.value);
        if (selected.type === "series") return article.series === selected.value;
        if (selected.type === "year") return article.createdAt.getFullYear().toString() === selected.value;
    }).sort((a, b) => -(a.createdAt.getTime() - b.createdAt.getTime()));

    return (
        <aside className={clsx("w-full lg:w-80 m-2 overflow-auto xc-scroll flex-col space-y-2", className)}>
            <DropdownSelector all={{tags, series, years}} selected={selected} setSelection={setSelected}/>
            <Paper className="p-4 flex-grow h-0">
                <p className="px-1.5 text-text-subnote text-sm">{selectedLabel}</p>
                <div className="divide-y divide-dashed divide-bg-tag">
                    {selected.type === "all" && (
                        <Link href="/editor/new" className="block p-1.5 text-text-content justify-between hover:bg-bg-hover">
                            新建文章
                        </Link>
                    )}
                    {filteredArticles.map(article => (
                        <Link className="block p-1.5 text-text-content justify-between hover:bg-bg-hover"
                              key={article.slug}
                              href={`/editor/${article.slug}`}>
                            {article.title}
                        </Link>
                    ))}
                </div>
            </Paper>
        </aside>
    );
}

export default ArticleClassifier;
