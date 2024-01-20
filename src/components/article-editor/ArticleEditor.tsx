"use client";

import DangerousButton from "@/components/article-editor/DangerousButton";
import ImageUploader from "@/components/article-editor/ImageUploader";
import MarkdownPreview from "@/components/article-editor/MarkdownPreview";
import Dialog from "@/components/base/Dialog";
import Paper from "@/components/base/Paper";
import {CreateArticleAction, DeleteArticleAction, LogoutAction, SaveArticleAction} from "@/lib/actions";
import {Article, ArticleCreate, ArticlePatch} from "@/lib/article";
import clsx from "clsx";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {useCallback, useEffect, useState} from "react";

interface ArticleEditorProps {
    article: Article;
    className?: string;
}

function ArticleEditor({article, className}: ArticleEditorProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isPreview, setIsPreview] = useState(false);
    const [isEditInfo, setIsEditInfo] = useState(false);
    const [isUploadImage, setIsUploadImage] = useState(false);
    const [slug, setSlug] = useState(article.slug);
    const [title, setTitle] = useState(article.title);
    const [description, setDescription] = useState("");
    const [content, setContent] = useState("");
    const [series, setSeries] = useState("");
    const [tags, setTags] = useState("");

    useEffect(() => {
        setSlug(article.slug);
        setTitle(article.title);
        setDescription(article.description);
        setContent(article.content);
        setSeries(article.series);
        setTags(article.tags.join(", "));
    }, [article]);

    const handleSaveArticle = useCallback(async () => {
        // check
        if (!slug) {
            alert("链接不能为空");
            return;
        }
        if (!title) {
            alert("标题不能为空");
            return;
        }
        if (!slug.match(/^[a-z0-9-]+$/)) {
            alert("链接只能包含小写字母、数字和连字符");
            return;
        }
        if (slug === "new" || slug === "index") {
            // 不是不能正确显示, 只是不能正确静态导出
            alert("链接不能为 new 或 index");
            return;
        }
        if (tags.match(/[\/\\]/)) {
            // 不是不能正确显示, 只是 Windows 下不能正确静态导出, Linux 下没问题
            alert("标签不能包含 / 或 \\");
            return;
        }
        if (series.match(/[\/\\]/)) {
            // 同上
            alert("系列不能包含 / 或 \\");
            return;
        }

        setIsLoading(true);
        let result;
        if (!article.id) {
            const newArticle: ArticleCreate = {
                slug: slug,
                title: title,
                description: description,
                content: content,
                series: series || "未分类",
                tags: tags.split(/,\s*/).map(tag => tag.trim()),
                published: true,
            };
            result = await CreateArticleAction(newArticle);
        } else {
            const patchArticle: ArticlePatch = {
                id: article.id,
                slug: slug.trim(),
                title: title.trim(),
                description: description.trim(),
                content: content.trim(),
                series: series.trim() || "未分类",
                tags: tags.replace(/\s+/, " ").split(/,\s*/).map(tag => tag.trim()),
                updatedAt: new Date(),
            };
            result = await SaveArticleAction(patchArticle);
        }
        if (result) {
            router.replace(`/editor/${slug}`);
        } else {
            alert("保存失败");
        }
        setIsLoading(false);
    }, [article, slug, title, description, content, series, tags, router]);

    const handleDeleteArticle = async () => {
        if (article.id) {
            const result = await DeleteArticleAction(article.id);
            if (result) {
                router.replace("/editor");
            } else {
                alert("删除失败");
            }
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === "s") {
                e.preventDefault();
                handleSaveArticle();
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [handleSaveArticle]);

    const handleLogout = async () => {
        await LogoutAction();
    };

    return (
        <main className={clsx("flex-grow flex-col space-y-2 m-2", className)}>
            <div className="flex flex-row flex-wrap justify-start items-center gap-x-4 gap-y-2">
                <div className="flex flex-row flex-nowrap items-center max-w-full basis-64 flex-shrink flex-grow">
                    <label htmlFor="article-editor-menu-slug" className="mr-2">链接</label>
                    <input id="article-editor-menu-slug" type="text" required value={slug}
                           onChange={e => setSlug(e.target.value)}
                           className="flex-grow w-0 text-sm shadow appearance-none border rounded py-2 px-3 bg-bg-light text-text-content focus:outline-none focus:shadow-link-content focus:border-link-content"/>
                </div>
                <div className="flex flex-row flex-nowrap items-center max-w-full basis-96 flex-shrink flex-grow">
                    <label htmlFor="article-editor-menu-title" className="mr-2">标题</label>
                    <input id="article-editor-menu-title" type="text" required value={title}
                           onChange={e => setTitle(e.target.value)}
                           className="flex-grow w-0 text-sm shadow appearance-none border rounded py-2 px-3 bg-bg-light text-text-content focus:outline-none focus:shadow-link-content focus:border-link-content"/>
                </div>
                <div>
                    <button
                        onClick={() => setIsEditInfo(true)} type="button"
                        className="rounded-md bg-bg-light px-3 py-2 text-sm text-text-content shadow-sm hover:bg-bg-hover">
                        编辑信息
                    </button>
                    <Dialog open={isEditInfo} blur
                            onClose={() => setIsEditInfo(false)}>
                        <Paper
                            className="p-4 max-w-full max-h-[90vh] w-[480px] lg:w-[640px] xl:w-[960px] overflow-y-auto xc-scroll flex flex-col gap-y-2">
                            <div className="pb-4 text-text-main">编辑信息</div>
                            <div className="w-full">
                                <label htmlFor="article-editor-info-slug"
                                       className="block text-sm font-medium leading-6 text-text-content">
                                    链接
                                </label>
                                <div className="mt-2">
                                    <input id="article-editor-info-slug" type="text" required value={slug}
                                           onChange={(e) => setSlug(e.target.value)}
                                           className="block w-full text-sm shadow appearance-none border rounded py-2 px-3 bg-bg-light text-text-content focus:outline-none focus:shadow-link-content focus:border-link-content"/>
                                </div>
                            </div>
                            <div className="w-full">
                                <label htmlFor="article-editor-info-email"
                                       className="block text-sm font-medium leading-6 text-text-content">
                                    标题
                                </label>
                                <div className="mt-2">
                                    <input id="article-editor-info-email" type="text" required value={title}
                                           onChange={(e) => setTitle(e.target.value)}
                                           className="block w-full text-sm shadow appearance-none border rounded py-2 px-3 bg-bg-light text-text-content focus:outline-none focus:shadow-link-content focus:border-link-content"/>
                                </div>
                            </div>
                            <div className="w-full">
                                <label htmlFor="article-editor-info-description"
                                       className="block text-sm font-medium leading-6 text-text-content">
                                    简要概述
                                </label>
                                <div className="mt-2">
                                    <textarea id="article-editor-info-description" required value={description}
                                              onChange={(e) => setDescription(e.target.value)}
                                              className="block w-full text-sm font-mono h-32 resize-none overflow-auto shadow appearance-none border rounded py-2 px-3 bg-bg-light text-text-content focus:outline-none focus:shadow-link-content focus:border-link-content xc-scroll"/>
                                </div>
                            </div>
                            <div className="w-full">
                                <label htmlFor="article-editor-info-series"
                                       className="block text-sm font-medium leading-6 text-text-content">
                                    系列
                                </label>
                                <div className="mt-2 flex flex-col lg:flex-row">
                                    <input id="article-editor-info-series" type="text" required value={series}
                                           onChange={(e) => setSeries(e.target.value)}
                                           className="block w-full text-sm shadow appearance-none border rounded py-2 px-3 bg-bg-light text-text-content focus:outline-none focus:shadow-link-content focus:border-link-content"/>
                                </div>
                            </div>
                            <div className="w-full">
                                <label htmlFor="article-editor-info-tags"
                                       className="block text-sm font-medium leading-6 text-text-content">
                                    标签
                                </label>
                                <div className="mt-2 flex flex-col lg:flex-row">
                                    <input id="article-editor-info-tags" type="text" required value={tags}
                                           onChange={(e) => setTags(e.target.value)}
                                           className="block w-full text-sm shadow appearance-none border rounded py-2 px-3 bg-bg-light text-text-content focus:outline-none focus:shadow-link-content focus:border-link-content"/>
                                </div>
                            </div>
                            <button
                                className="mt-2 w-full rounded-md bg-button-bg px-3 py-2 text-sm text-button-text shadow-sm hover:bg-button-hover"
                                type="button" onClick={() => setIsEditInfo(false)}>
                                确定
                            </button>
                        </Paper>
                    </Dialog>
                </div>
                <button onClick={() => setIsPreview(prev => !prev)} type="button"
                        className="rounded-md bg-bg-light px-3 py-2 text-sm text-text-content shadow-sm hover:bg-bg-hover xl:hidden">
                    {isPreview ? "编辑" : "预览"}
                </button>
                <div>
                    <button
                        onClick={() => setIsUploadImage(true)} type="button"
                        className="rounded-md bg-bg-light px-3 py-2 text-sm text-text-content shadow-sm hover:bg-bg-hover">
                        上传图片
                    </button>
                    <Dialog open={isUploadImage} blur
                            onClose={() => setIsUploadImage(false)}>
                        <ImageUploader className="max-w-full"/>
                    </Dialog>
                </div>
                {article.id && (
                    <Link
                        href={`/post/${slug}`}
                        className="rounded-md bg-bg-light px-3 py-2 text-sm text-text-content shadow-sm hover:bg-bg-hover">
                        转到文章
                    </Link>
                )}
                <button
                    onClick={handleSaveArticle} disabled={isLoading} type="button"
                    className="rounded-md bg-button-bg px-3 py-2 text-sm text-button-text shadow-sm hover:bg-button-hover disabled:bg-bg-hover">
                    保存
                </button>
                {article.id && (
                    <DangerousButton
                        className="rounded-md bg-bg-light px-3 py-2 text-sm text-text-content shadow-sm hover:bg-bg-hover"
                        onClick={handleDeleteArticle}>
                        删除文章
                    </DangerousButton>
                )}
                <Link
                    href="/editor" title="返回文章选择页"
                    className="rounded-md bg-bg-light px-3 py-2 text-sm text-text-content shadow-sm hover:bg-bg-hover lg:hidden">
                    返回
                </Link>
                <button
                    onClick={handleLogout} type="button"
                    className="rounded-md bg-bg-light px-3 py-2 text-sm text-text-content shadow-sm hover:bg-bg-hover">
                    登出
                </button>
            </div>
            <div className="flex-grow h-0 rounded-lg flex flex-row gap-x-4">
                <textarea aria-label="输入区" id="article-editor-content" value={content}
                          onChange={e => setContent(e.target.value)}
                          className={clsx(isPreview ? "hidden xl:block" : "block", "w-0 text-sm 2xl:text-base flex-grow font-mono resize-none p-2 bg-bg-light overflow-auto shadow appearance-none border rounded text-text-content leading-tight focus:outline-none focus:shadow-link-content focus:border-link-content pk-scroll")}/>
                <Paper
                    className={clsx(isPreview ? "block" : "hidden xl:block", "w-0 flex-grow p-4 text-sm 2xl:text-base overflow-auto pk-scroll")}>
                    <MarkdownPreview content={content}/>
                </Paper>
            </div>
        </main>
    );
}

export default ArticleEditor;
