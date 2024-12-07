"use client";

import ImageUploader from "@/components/article-editor/ImageUploader";
import MarkdownEditor from "@/components/article-editor/MarkdownEditor";
import Dialog from "@/components/base/Dialog";
import Paper from "@/components/base/Paper";
import DangerousButton from "@/components/DangerousButton";
import {
    CreateArticleAction,
    DeleteArticleAction,
    LogoutAction,
    SaveArticleAction,
    UploadCoverAction,
} from "@/lib/actions";
import {Article, ArticleCreate, ArticlePatch} from "@/lib/article";
import L from "@/lib/links";
import clsx from "clsx";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {MouseEventHandler, useActionState, useCallback, useEffect, useRef, useState} from "react";
import {useFormStatus} from "react-dom";
import {useTranslations} from "next-intl";

function SubmitCoverButton() {
    const {pending} = useFormStatus();
    const t = useTranslations("article-editor.ArticleEditor");

    return (
        <input
            className="rounded-md bg-button-bg mt-1 px-3 py-2 text-sm text-button-text shadow-sm hover:bg-button-hover disabled:bg-bg-hover"
            disabled={pending} type="submit" value={t("uploadImage")}/>
    );
}

function formatDate(date: Date) {
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

interface ArticleEditorProps {
    article: Article;
    allTags: Array<string>;
    className?: string;
}

function ArticleEditor({article, allTags, className}: ArticleEditorProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isPreview, setIsPreview] = useState(false);
    const [isEditInfo, setIsEditInfo] = useState(false);
    const [isUploadImage, setIsUploadImage] = useState(false);
    const [slug, setSlug] = useState(article.slug);
    const [title, setTitle] = useState(article.title);
    const [cover, setCover] = useState<File>();
    const [description, setDescription] = useState("");
    const [content, setContent] = useState("");
    const [series, setSeries] = useState("");
    const [tags, setTags] = useState<Array<string>>([]);
    const [newTag, setNewTag] = useState("");
    const [createdAt, setCreatedAt] = useState(formatDate(article.createdAt));
    const t = useTranslations("article-editor.ArticleEditor");

    const coverSelectorRef = useRef<HTMLInputElement>(null);

    const [_, uploadCoverFormAction] = useActionState(UploadCoverAction, "");

    useEffect(() => {
        setSlug(article.slug);
        setTitle(article.title);
        setDescription(article.description);
        setContent(article.content);
        setSeries(article.series);
        setTags(article.tags);
        setCreatedAt(formatDate(article.createdAt));
    }, [article]);

    const handleSaveArticle = useCallback(async () => {
        // check
        if (!slug) {
            alert(t("alert.slugEmpty"));
            return;
        }
        if (!title) {
            alert(t("alert.titleEmpty"));
            return;
        }
        if (!slug.match(/^[a-z0-9-]+$/)) {
            alert(t("alert.slugError"));
            return;
        }
        if (slug === "new" || slug === "index") {
            // 不是不能正确显示, 只是不能正确静态导出
            alert(t("alert.slugReserved"));
            return;
        }
        if (tags.find(tag => tag.match(/[\/\\]/))) {
            // 不是不能正确显示, 只是 Windows 下不能正确静态导出, Linux 下没问题
            alert(t("alert.tagError"));
            return;
        }
        if (series.match(/[\/\\]/)) {
            // 同上
            alert(t("alert.seriesError"));
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
                series: series || t("defaultSeries"),
                tags: tags.map(tag => tag.trim()),
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
                series: series.trim() || t("defaultSeries"),
                tags: tags.map(tag => tag.trim()),
                updatedAt: new Date(),
            };
            const newDate = new Date(createdAt);
            if (!isNaN(newDate.getTime()) && newDate !== article.createdAt) {
                patchArticle.createdAt = newDate;
            }
            result = await SaveArticleAction(patchArticle);
        }
        if (result) {
            router.replace(L.editor.post(slug));
        } else {
            alert(t("alert.saveError"));
        }
        setIsLoading(false);
    }, [article, slug, title, description, content, series, tags, createdAt, router]);

    const handleOpenEditInfo: MouseEventHandler = (e) => {
        e.stopPropagation();
        setIsEditInfo(true);
    };
    const handleOpenImageUploader: MouseEventHandler = (e) => {
        e.stopPropagation();
        setIsUploadImage(true);
    };

    const getCoverPreview = () => {
        if (cover) {
            return URL.createObjectURL(cover);
        }
        if (article.id) {
            return L.image.cover(article.id);
        }
        return L.image.cover("random");
    };

    const handleCoverClick = () => {
        if (coverSelectorRef.current) {
            coverSelectorRef.current.click();
        }
    };

    const addTagQuick = (tag: string) => {
        setTags([...tags, tag]);
    };

    const addTag = () => {
        if (newTag === "") return;
        setTags([...tags, newTag]);
        setNewTag("");
    };

    const removeTag = (index: number) => {
        const newTags = [...tags];
        newTags.splice(index, 1);
        setTags(newTags);
    };

    const handleDeleteArticle = async () => {
        if (article.id) {
            const result = await DeleteArticleAction(article.id);
            if (result) {
                router.replace(L.editor.post());
            } else {
                alert(t("alert.deleteError"));
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

    const otherTags = allTags.filter(tag => !tags.includes(tag));

    return (
        <main className={clsx("flex-grow flex-col space-y-2 m-2", className)}>
            <div className="flex flex-row flex-wrap justify-start items-center gap-x-4 gap-y-2">
                <div className="flex flex-row flex-nowrap items-center max-w-full basis-64 flex-shrink flex-grow">
                    <label htmlFor="article-editor-menu-slug" className="mr-2 text-text-content">{t("slug")}</label>
                    <input id="article-editor-menu-slug" type="text" required value={slug}
                           onChange={e => setSlug(e.target.value)}
                           className="flex-grow w-0 text-sm shadow appearance-none border rounded py-2 px-3 bg-bg-light text-text-content focus:outline-none focus:shadow-link-content focus:border-link-content"/>
                </div>
                <div className="flex flex-row flex-nowrap items-center max-w-full basis-96 flex-shrink flex-grow">
                    <label htmlFor="article-editor-menu-title" className="mr-2 text-text-content">{t("title")}</label>
                    <input id="article-editor-menu-title" type="text" required value={title}
                           onChange={e => setTitle(e.target.value)}
                           className="flex-grow w-0 text-sm shadow appearance-none border rounded py-2 px-3 bg-bg-light text-text-content focus:outline-none focus:shadow-link-content focus:border-link-content"/>
                </div>
                <div>
                    <button
                        onClick={handleOpenEditInfo} type="button"
                        className="rounded-md bg-bg-light px-3 py-2 text-sm text-text-content shadow-sm hover:bg-bg-hover">
                        {t("editMetadata")}
                    </button>
                    <Dialog open={isEditInfo} blur clickOutsideClose onClose={() => setIsEditInfo(false)}>
                        <Paper
                            className="p-4 max-w-full max-h-[90vh] w-[480px] lg:w-[640px] xl:w-[960px] overflow-y-auto xc-scroll flex flex-col gap-y-2">
                            <div className="pb-4 text-text-main">{t("editMetadata")}</div>
                            <div className="w-full">
                                <label htmlFor="article-editor-info-slug"
                                       className="block text-sm font-medium leading-6 text-text-content">
                                    {t("slug")}
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
                                    {t("title")}
                                </label>
                                <div className="mt-2">
                                    <input id="article-editor-info-email" type="text" required value={title}
                                           onChange={(e) => setTitle(e.target.value)}
                                           className="block w-full text-sm shadow appearance-none border rounded py-2 px-3 bg-bg-light text-text-content focus:outline-none focus:shadow-link-content focus:border-link-content"/>
                                </div>
                            </div>
                            {article.id && (
                                <form className="w-full" action={uploadCoverFormAction}>
                                    <input type="hidden" name="id" value={article.id}/>
                                    <input type="hidden" name="slug" value={article.slug}/>
                                    <label htmlFor="article-editor-cover"
                                           className="block text-sm font-medium leading-6 text-text-content">
                                        {t("cover")}
                                        <p className="text-sm text-text-subnote">
                                            {t("coverDescription")}
                                        </p>
                                    </label>
                                    <div className="mt-1">
                                        <input ref={coverSelectorRef} id="article-editor-cover" type="file" name="cover"
                                               onChange={e => setCover(e.target.files?.[0])}
                                               className="hidden" accept="image/webp,image/png,image/jpeg"/>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            className="w-[520px] max-w-full aspect-[130/63] object-cover rounded border-2 border-bg-tag"
                                            onClick={handleCoverClick}
                                            src={getCoverPreview()} height={1300} width={630} alt="Avatar"/>
                                    </div>
                                    <SubmitCoverButton/>
                                </form>
                            )}
                            <div className="w-full">
                                <label htmlFor="article-editor-info-description"
                                       className="block text-sm font-medium leading-6 text-text-content">
                                    {t("summary")}
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
                                    {t("series")}
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
                                    {t("tags")}
                                </label>
                                <div
                                    className="flex flex-row flex-wrap p-2 md:p-3 text-sm text-text-content gap-2 select-none">
                                    {tags.map((tag, index) => (
                                        <button
                                            key={`tag-${tag}`} onClick={() => removeTag(index)}
                                            className="py-1 px-2 border-text-content hover:bg-bg-hover border-solid border-[1px] rounded-full tag-prefix">
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                                <label htmlFor="article-editor-info-tags"
                                       className="block text-sm font-medium leading-6 text-text-subnote">
                                    {t("tagQuickAdd")}
                                </label>
                                <div
                                    className="flex flex-row flex-wrap p-2 md:p-3 text-sm text-text-subnote gap-2 select-none">
                                    {otherTags.map((tag) => (
                                        <button
                                            key={`tag-other-${tag}`} onClick={() => addTagQuick(tag)}
                                            className="py-1 px-2 border-text-subnote hover:text-text-content hover:bg-bg-hover border-solid border-[1px] rounded-full tag-prefix">
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                                <div className="mt-1 flex flex-row flex-nowrap items-center max-w-full">
                                    <input id="site-editor-keywords" aria-label="输入 Keyword" name="keywords[]"
                                           type="text" value={newTag} onChange={e => setNewTag(e.target.value)}
                                           className="flex-grow text-sm shadow appearance-none border rounded py-2 px-3 bg-bg-light text-text-content focus:outline-none focus:shadow-link-content focus:border-link-content"/>
                                    <button
                                        className="ml-4 rounded-md outline outline-1 outline-button-bg bg-bg-light hover:bg-bg-hover px-3 py-2 text-sm text-text-content shadow-sm"
                                        type="button" onClick={() => addTag()}>
                                        {t("tagCreate")}
                                    </button>
                                </div>
                            </div>
                            <div className="w-full">
                                <label htmlFor="article-editor-info-created-at"
                                       className="block text-sm font-medium leading-6 text-text-content">
                                    {t("createdAt")}
                                </label>
                                <div className="mt-2 flex flex-col lg:flex-row">
                                    <input id="article-editor-info-created-at" type="datetime-local" required
                                           value={createdAt} onChange={e => setCreatedAt(e.target.value)}
                                           className="block w-full text-sm shadow appearance-none border rounded py-2 px-3 bg-bg-light text-text-content focus:outline-none focus:shadow-link-content focus:border-link-content"/>
                                </div>
                            </div>
                            <button
                                className="mt-2 w-full rounded-md bg-button-bg px-3 py-2 text-sm text-button-text shadow-sm hover:bg-button-hover"
                                type="button" onClick={() => setIsEditInfo(false)}>
                                {t("saveMetadata")}
                            </button>
                        </Paper>
                    </Dialog>
                </div>
                <button onClick={() => setIsPreview(prev => !prev)} type="button"
                        className="rounded-md bg-bg-light px-3 py-2 text-sm text-text-content shadow-sm hover:bg-bg-hover xl:hidden">
                    {isPreview ? t("edit") : t("preview")}
                </button>
                <div>
                    <button
                        onClick={handleOpenImageUploader} type="button"
                        className="rounded-md bg-bg-light px-3 py-2 text-sm text-text-content shadow-sm hover:bg-bg-hover">
                        {t("uploadImage")}
                    </button>
                    <Dialog open={isUploadImage} blur clickOutsideClose
                            onClose={() => setIsUploadImage(false)}>
                        <ImageUploader className="max-w-full"/>
                    </Dialog>
                </div>
                {article.id && (
                    <Link
                        href={L.post(article.slug)}
                        className="rounded-md bg-bg-light px-3 py-2 text-sm text-text-content shadow-sm hover:bg-bg-hover">
                        {t("toArticlePage")}
                    </Link>
                )}
                <button
                    onClick={handleSaveArticle} disabled={isLoading} type="button"
                    className="rounded-md bg-button-bg px-3 py-2 text-sm text-button-text shadow-sm hover:bg-button-hover disabled:bg-bg-hover">
                    {t("save")}
                </button>
                {article.id && (
                    <DangerousButton
                        className="rounded-md bg-bg-light px-3 py-2 text-sm shadow-sm hover:bg-bg-hover"
                        onClick={handleDeleteArticle}>
                        {t("delete")}
                    </DangerousButton>
                )}
                <Link
                    href={L.editor.post()} title={t("backDescription")}
                    className="rounded-md bg-bg-light px-3 py-2 text-sm text-text-content shadow-sm hover:bg-bg-hover lg:hidden">
                    {t("back")}
                </Link>
                <button
                    onClick={handleLogout} type="button"
                    className="rounded-md bg-bg-light px-3 py-2 text-sm text-text-content shadow-sm hover:bg-bg-hover">
                    {t("logout")}
                </button>
            </div>
            <MarkdownEditor initContent={article.content} content={content} setContent={setContent}
                            isPreview={isPreview}
                            className="flex-grow h-0"/>
        </main>
    );
}

export default ArticleEditor;
