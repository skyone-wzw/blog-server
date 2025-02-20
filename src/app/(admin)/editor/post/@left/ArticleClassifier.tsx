"use client";

import Paper from "@/components/base/Paper";
import {ArticleMetadata} from "@/lib/article";
import L from "@/lib/links";
import clsx from "clsx";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {useEffect, useRef, useState} from "react";
import {useTranslations} from "next-intl";

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
    const t = useTranslations("page.admin.editor.post.ArticleClassifier");

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
                        className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-button-bg px-3 py-2 text-sm text-button-text shadow-xs hover:bg-button-hover"
                        id="menu-button" aria-expanded={isOpen} aria-haspopup={isOpen}>
                    {t("filter")}
                    <svg className="-mr-1 h-5 w-5" viewBox="0 0 20 20" fill="currentColor"
                         aria-hidden="true">
                        <path fillRule="evenodd"
                              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                              clipRule="evenodd"/>
                    </svg>
                </button>
            </div>

            <div
                className={clsx("absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-bg-light shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-hidden", isOpen ? "block" : "hidden")}
                role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex={-1}>
                <div className="py-1 text-text-content overflow-y-auto xc-scroll article-dropdown-selector" role="none">
                    <button className="block text-start w-full px-4 py-2 text-sm hover:bg-bg-hover"
                            role="menuitem" type="button"
                            onClick={() => setSelection({type: "all", value: ""})}>
                        {t("all")}
                    </button>
                    <p className="px-2 py-1 text-text-subnote text-sm">{t("bySeries")}</p>
                    {all.series.map(series => (
                        <button key={series} role="menuitem" type="button"
                                className={clsx("block text-start w-full px-4 py-2 text-sm hover:bg-bg-hover", selected.value === series && "bg-bg-hover")}
                                onClick={() => setSelection({type: "series", value: series})}>
                            {series}
                        </button>
                    ))}
                    <p className="px-2 py-1 text-text-subnote text-sm">{t("byTags")}</p>
                    {all.tags.map(tag => (
                        <button key={tag} role="menuitem" type="button"
                                className="block text-start w-full px-4 py-2 text-sm hover:bg-bg-hover"
                                onClick={() => setSelection({type: "tag", value: tag})}>
                            {tag}
                        </button>
                    ))}
                    <p className="px-2 py-1 text-text-subnote text-sm">{t("byYear")}</p>
                    {all.years.map(year => (
                        <button key={year} role="menuitem" type="button"
                                className="block text-start w-full px-4 py-2 text-sm hover:bg-bg-hover"
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
    const pathname = usePathname();
    const [selected, setSelected] = useState<SelectedState>({type: "all", value: ""});
    const t = useTranslations("page.admin.editor.post.ArticleClassifier");

    const tags = Array.from(new Set(articles.flatMap(article => article.tags))).sort();
    const series = Array.from(new Set(articles.map(article => article.series))).sort();
    const years = Array.from(new Set(articles.map(article => article.createdAt.getFullYear().toString()))).sort();

    const isSelectPage = pathname === L.editor.post();

    const selectedLabel = selected.type === "all" ? t("all") :
        selected.type === "tag" ? t("tags", {tag: selected.value}) :
            selected.type === "series" ? t("series", {series: selected.value}) :
                t("year", {year: selected.value});

    const filteredArticles = articles.filter(article => {
        if (selected.type === "all") return true;
        if (selected.type === "tag") return article.tags.includes(selected.value);
        if (selected.type === "series") return article.series === selected.value;
        if (selected.type === "year") return article.createdAt.getFullYear().toString() === selected.value;
    }).sort((a, b) => -(a.createdAt.getTime() - b.createdAt.getTime()));

    return (
        <aside
            className={clsx("w-full lg:w-80 m-2 flex-col space-y-2", isSelectPage ? "flex" : "hidden lg:flex", className)}>
            <DropdownSelector all={{tags, series, years}} selected={selected} setSelection={setSelected}/>
            <Paper className="py-4 grow h-0">
                <p className="px-4 text-text-subnote text-sm">{selectedLabel}</p>
                <div className="px-2.5 divide-y divide-dashed divide-bg-tag max-h-full overflow-auto xc-scroll">
                    {selected.type === "all" && (
                        <Link href={L.editor.post("new")}
                              className="block p-2 text-sm text-text-content justify-between hover:bg-bg-hover">
                            {t("new")}
                        </Link>
                    )}
                    {filteredArticles.map(article => (
                        <Link className="block p-2 text-sm text-text-content justify-between hover:bg-bg-hover"
                              key={article.slug}
                              href={L.editor.post(article.slug)}>
                            {article.title}
                        </Link>
                    ))}
                </div>
            </Paper>
        </aside>
    );
}

export default ArticleClassifier;
