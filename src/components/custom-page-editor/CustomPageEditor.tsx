"use client";

import ImageUploader from "@/components/article-editor/ImageUploader";
import MarkdownEditor from "@/components/article-editor/MarkdownEditor";
import Dialog from "@/components/base/Dialog";
import Paper from "@/components/base/Paper";
import DangerousButton from "@/components/DangerousButton";
import {LogoutAction} from "@/lib/actions";
import {
    CustomPage,
    CustomPageCreate,
    CustomPagePatch,
    CustomPageReservedPrefix,
    CustomPageReservedPrefixRegex,
} from "@/lib/custom-page";
import {CreateCustomPageAction, DeleteCustomPageAction, SaveCustomPageAction} from "@/lib/custom-page-actions";
import L from "@/lib/links";
import clsx from "clsx";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {MouseEventHandler, useCallback, useEffect, useState} from "react";
import {useTranslations} from "next-intl";

interface CustomPageEditorProps {
    page: CustomPage;
    className?: string;
}

function CustomPageEditor({page, className}: CustomPageEditorProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isPreview, setIsPreview] = useState(false);
    const [isEditInfo, setIsEditInfo] = useState(false);
    const [isUploadImage, setIsUploadImage] = useState(false);
    const [slug, setSlug] = useState(page.slug);
    const [title, setTitle] = useState(page.title);
    const [description, setDescription] = useState("");
    const [content, setContent] = useState("");
    const t = useTranslations("custom-page-editor.CustomPageEditor")

    useEffect(() => {
        setSlug(page.slug);
        setTitle(page.title);
        setDescription(page.description);
        setContent(page.content);
    }, [page]);

    const handleSaveCustomPage = useCallback(async () => {
        // check
        if (!slug) {
            alert(t("alert.slugEmpty"));
            return;
        }
        if (!title) {
            alert(t("alert.titleEmpty"));
            return;
        }
        if (!slug.match(/^(?:\/[a-z0-9-]+)+$/)) {
            alert(t("alert.slugError"));
            return;
        }
        if (slug.match(CustomPageReservedPrefixRegex)) {
            alert(t("alert.slugReserved", {reserved: CustomPageReservedPrefix.join(", ")}));
            return;
        }

        setIsLoading(true);
        let result;
        if (!page.id) {
            const newCustomPage: CustomPageCreate = {
                slug: slug,
                title: title,
                description: description,
                content: content,
            };
            result = await CreateCustomPageAction(newCustomPage);
        } else {
            const patchCustomPage: CustomPagePatch = {
                id: page.id,
                slug: slug.trim(),
                title: title.trim(),
                description: description.trim(),
                content: content.trim(),
                updatedAt: new Date(),
            };
            result = await SaveCustomPageAction(patchCustomPage);
        }
        if (result) {
            router.replace(L.editor.custom(slug));
        } else {
            alert(t("alert.saveError"));
        }
        setIsLoading(false);
    }, [page, slug, title, description, content, router]);

    const handleOpenEditInfo: MouseEventHandler = (e) => {
        e.stopPropagation();
        setIsEditInfo(true);
    };
    const handleOpenImageUploader: MouseEventHandler = (e) => {
        e.stopPropagation();
        setIsUploadImage(true);
    };

    const handleDeleteArticle = async () => {
        if (page.id) {
            const result = await DeleteCustomPageAction(page.id);
            if (result) {
                router.replace(L.editor.custom());
            } else {
                alert(t("alert.deleteError"));
            }
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === "s") {
                e.preventDefault();
                handleSaveCustomPage();
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [handleSaveCustomPage]);

    const handleLogout = async () => {
        await LogoutAction();
    };

    return (
        <main className={clsx("flex-grow flex-col space-y-2 m-2", className)}>
            <div className="flex flex-row flex-wrap justify-start items-center gap-x-4 gap-y-2">
                <div className="flex flex-row flex-nowrap items-center max-w-full basis-64 flex-shrink flex-grow">
                    <label htmlFor="custom-page-editor-menu-slug" className="mr-2 text-text-content">{t("slug")}</label>
                    <input id="custom-page-editor-menu-slug" type="text" required value={slug}
                           onChange={e => setSlug(e.target.value)}
                           className="flex-grow w-0 text-sm shadow appearance-none border rounded py-2 px-3 bg-bg-light text-text-content focus:outline-none focus:shadow-link-content focus:border-link-content"/>
                </div>
                <div className="flex flex-row flex-nowrap items-center max-w-full basis-96 flex-shrink flex-grow">
                    <label htmlFor="custom-page-editor-menu-title" className="mr-2 text-text-content">{t("title")}</label>
                    <input id="custom-page-editor-menu-title" type="text" required value={title}
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
                                <label htmlFor="custom-page-editor-info-slug"
                                       className="block text-sm font-medium leading-6 text-text-content">
                                    {t("slug")}
                                </label>
                                <div className="mt-2">
                                    <input id="custom-page-editor-info-slug" type="text" required value={slug}
                                           onChange={(e) => setSlug(e.target.value)}
                                           className="block w-full text-sm shadow appearance-none border rounded py-2 px-3 bg-bg-light text-text-content focus:outline-none focus:shadow-link-content focus:border-link-content"/>
                                </div>
                            </div>
                            <div className="w-full">
                                <label htmlFor="custom-page-editor-info-email"
                                       className="block text-sm font-medium leading-6 text-text-content">
                                    {t("title")}
                                </label>
                                <div className="mt-2">
                                    <input id="custom-page-editor-info-email" type="text" required value={title}
                                           onChange={(e) => setTitle(e.target.value)}
                                           className="block w-full text-sm shadow appearance-none border rounded py-2 px-3 bg-bg-light text-text-content focus:outline-none focus:shadow-link-content focus:border-link-content"/>
                                </div>
                            </div>
                            <div className="w-full">
                                <label htmlFor="custom-page-editor-info-description"
                                       className="block text-sm font-medium leading-6 text-text-content">
                                    {t("summary")}
                                </label>
                                <div className="mt-2">
                                    <textarea id="custom-page-editor-info-description" required value={description}
                                              onChange={(e) => setDescription(e.target.value)}
                                              className="block w-full text-sm font-mono h-32 resize-none overflow-auto shadow appearance-none border rounded py-2 px-3 bg-bg-light text-text-content focus:outline-none focus:shadow-link-content focus:border-link-content xc-scroll"/>
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
                {page.id && (
                    <Link
                        href={L.custom(page.slug)}
                        className="rounded-md bg-bg-light px-3 py-2 text-sm text-text-content shadow-sm hover:bg-bg-hover">
                        {t("toCustomPage")}
                    </Link>
                )}
                <button
                    onClick={handleSaveCustomPage} disabled={isLoading} type="button"
                    className="rounded-md bg-button-bg px-3 py-2 text-sm text-button-text shadow-sm hover:bg-button-hover disabled:bg-bg-hover">
                    {t("save")}
                </button>
                {page.id && (
                    <DangerousButton
                        className="rounded-md bg-bg-light px-3 py-2 text-sm shadow-sm hover:bg-bg-hover"
                        onClick={handleDeleteArticle}>
                        {t("delete")}
                    </DangerousButton>
                )}
                <Link
                    href={L.editor.custom()} title={t("backDescription")}
                    className="rounded-md bg-bg-light px-3 py-2 text-sm text-text-content shadow-sm hover:bg-bg-hover lg:hidden">
                    {t("back")}
                </Link>
                <button
                    onClick={handleLogout} type="button"
                    className="rounded-md bg-bg-light px-3 py-2 text-sm text-text-content shadow-sm hover:bg-bg-hover">
                    {t("logout")}
                </button>
            </div>
            <MarkdownEditor initContent={page.content} content={content} setContent={setContent} isPreview={isPreview}
                            className="flex-grow h-0"/>
        </main>
    );
}

export default CustomPageEditor;
