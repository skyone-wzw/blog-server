"use client";

import Paper from "@/components/base/Paper";
import {ArticleTitle} from "@/lib/article";
import {FediverseCommentWithGuest, FediverseGuestName, GetCommentOptions} from "@/lib/comment";
import {useEffect, useState} from "react";
import Link from "next/link";
import {CommentHASTRender} from "@/components/markdown/CommentHASTRender";
import {useFormatter, useNow, useTranslations} from "next-intl";
import "katex/dist/katex.css";
import "@/components/markdown/article.css";
import L from "@/lib/links";
import AvatarTooltip from "@/components/comment/AvatarTooltip";
import {ImgWithViewer} from "@/components/tools/ImageWithViewer";
import {DeleteCommentAction, FetchCommentsAction, UpdateCommentAction, UpdateGuestAction} from "@/lib/comment-actions";
import DangerousButton from "@/components/DangerousButton";

interface CommentsManagerProps {
    articles: ArticleTitle[];
    guests: FediverseGuestName[];
    fallbackAvatar: string;
}

type HiddenOption = "all" | "visible" | "hidden";
const perPage = 5;

function CommentsManager({articles, guests, fallbackAvatar}: CommentsManagerProps) {
    const [article, setArticle] = useState("all");
    const [guest, setGuest] = useState("all");
    const [hidden, setHidden] = useState<HiddenOption>("visible");
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(1);
    const [comments, setComments] = useState<FediverseCommentWithGuest[]>([]);
    const t = useTranslations("page.admin.comments.CommentManager");
    const formatter = useFormatter();
    const now = useNow();

    const updateComments = (r: FediverseCommentWithGuest[]) => {
        setComments(r);
        setTotal(Math.ceil(r.length / perPage));
        setPage(1);
    };

    useEffect(() => {
        FetchCommentsAction({
            hidden: hidden === "all" ? undefined : hidden === "hidden",
            postId: article === "all" ? undefined : article,
            uid: guest === "all" ? undefined : guest,
        })
            .then(updateComments);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const banGuest = async (uid: string, isBanned: boolean) => {
        if (await UpdateGuestAction(uid, isBanned)) {
            setComments(comments =>
                comments.map(c => {
                    if (c.user.uid === uid) {
                        c.user.isBanned = isBanned;
                    }
                    return c;
                }));
        } else {
            alert(isBanned ? t("alert.banError") : t("alert.unbanError"));
        }
    };

    const hiddenComment = async (uid: string, isHidden: boolean) => {
        if (await UpdateCommentAction(uid, isHidden)) {
            setComments(comments =>
                comments.map(c => {
                    if (c.uid === uid) {
                        c.isHidden = isHidden;
                    }
                    return c;
                }));
        } else {
            alert(isHidden ? t("alert.hideError") : t("alert.showError"));
        }
    };

    const deleteComment = async (uid: string) => {
        if (await DeleteCommentAction(uid)) {
            setComments(comments =>
                comments.filter(c => c.uid !== uid));
        } else {
            alert(t("alert.deleteError"));
        }
    };

    const deleteGuest = async (uid: string) => {
        if (await UpdateGuestAction(uid, true)) {
            setComments(comments =>
                comments.filter(c => c.user.uid !== uid));
        } else {
            alert(t("alert.deleteError"));
        }
    }

    const findArticle = (id: string) => articles.find(a => a.id === id);

    const handleSearch = () => {
        const option: GetCommentOptions = {
            hidden: hidden === "all" ? undefined : hidden === "hidden",
            postId: article === "all" ? undefined : article,
            uid: guest === "all" ? undefined : guest,
        };
        FetchCommentsAction(option)
            .then(updateComments);
    };

    const pagedComments = comments.slice((page - 1) * perPage, page * perPage);

    return (
        <main className="mb-6 col-start-2 col-span-full space-y-6">
            <Paper className="col-span-full p-6">
                <h1 className="text-lg pb-2 mb-4 font-semibold text-text-main border-b-bg-tag border-b-[1px] border-solid">
                    Comments Manager
                </h1>
                <div className="flex flex-col gap-3 lg:grid lg:grid-cols-2">
                    <select name="aricle" value={article} onChange={e => setArticle(e.target.value)}
                            className="block max-w-full text-sm shadow-sm appearance-none border rounded-sm py-2 px-3 bg-bg-light text-text-content focus:outline-hidden focus:shadow-link-content focus:border-link-content">
                        <option key="all" value="all">{t("all")}</option>
                        {articles.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).map(article => (
                            <option key={article.id} value={article.id}>{article.title}</option>
                        ))}
                    </select>
                    <select name="guest" value={guest} onChange={e => setGuest(e.target.value)}
                            className="block max-w-full text-sm shadow-sm appearance-none border rounded-sm py-2 px-3 bg-bg-light text-text-content focus:outline-hidden focus:shadow-link-content focus:border-link-content">
                        <option key="all" value="all">{t("all")}</option>
                        {guests.map(guest => (
                            <option key={guest.id} value={guest.uid}>{guest.name} {guest.uid}</option>
                        ))}
                    </select>
                    <select name="hiddne" value={hidden} onChange={e => setHidden(e.target.value as HiddenOption)}
                            className="block max-w-full text-sm shadow-sm appearance-none border rounded-sm py-2 px-3 bg-bg-light text-text-content focus:outline-hidden focus:shadow-link-content focus:border-link-content">
                        <option key="all" value="all">{t("all")}</option>
                        <option key="visible" value="visible">{t("visible")}</option>
                        <option key="hidden" value="hidden">{t("hidden")}</option>
                    </select>
                    <button
                        className="rounded-md bg-button-bg px-3 py-2 text-sm text-button-text shadow-xs hover:bg-button-hover"
                        onClick={handleSearch}>搜索
                    </button>
                </div>
            </Paper>
            <div className="flex flex-col gap-6">
                {pagedComments.map(comment => {
                    const user = comment.user;
                    const article = findArticle(comment.postId)!;
                    return (
                        <Paper key={comment.id} className="flex flex-row flex-nowrap gap-2 p-6">
                            <div>
                                <AvatarTooltip fallbackAvatar={fallbackAvatar} guest={comment.user}/>
                            </div>
                            <div className="grow w-0">
                                <p>
                                    <Link className="text-link-content hover:text-link-hover"
                                          rel="noopener noreferrer"
                                          target="_blank" href={user.webUrl ?? user.url}>
                                        {user.name}
                                    </Link>
                                </p>
                                <p className="text-sm text-text-content">
                                    {t.rich("from", {
                                        link: (chunks) => (
                                            <Link className="hover:text-link-hover" rel="noopener noreferrer"
                                                  target="_blank" href={user.webUrl ?? user.url}>
                                                {chunks}
                                            </Link>
                                        ),
                                        uid: user.uid,
                                    })}
                                </p>
                                <p className="text-sm text-text-content">
                                    {t.rich("commentTo", {
                                        title: article.title,
                                        link: (chunks) => (
                                            <Link className="hover:text-link-hover" rel="noopener noreferrer"
                                                  target="_blank" href={L.post(article.slug)}>
                                                {chunks}
                                            </Link>
                                        ),
                                    })}
                                </p>
                                <p className="text-sm text-text-subnote">
                                    {t("createdAt", {
                                        time: now.getTime() - comment.createdAt.getTime() > 7 * 24 * 60 * 60 * 1000
                                            ? formatter.dateTime(comment.createdAt, "default")
                                            : formatter.relativeTime(comment.createdAt),
                                    })}
                                </p>
                                <div>
                                    <CommentHASTRender ast={JSON.parse(comment.parsed)}/>
                                </div>
                                {comment.images.length > 0 && (
                                    <div className="grid gap-2 after:content-[' '] after:col-span-full"
                                         style={{gridTemplateColumns: "repeat(auto-fit, minmax(128px, 1fr))"}}>
                                        {comment.images.map((image, index) => (
                                            <ImgWithViewer
                                                className="w-full aspect-square rounded-sm shadow-xs object-cover"
                                                key={index} src={image.url} alt={`comment-image-${index}`}/>
                                        ))}
                                    </div>
                                )}
                                <p className="text-text-subnote text-sm mt-2 space-x-2">
                                    <button className="rounded-md bg-bg-light px-3 py-2 text-sm hover:bg-bg-hover"
                                            onClick={() => banGuest(user.uid, !user.isBanned)}>
                                        {user.isBanned ? t("unbanUser") : t("banUser")}
                                    </button>
                                    <button className="rounded-md bg-bg-light px-3 py-2 text-sm hover:bg-bg-hover"
                                            onClick={() => hiddenComment(comment.uid, !comment.isHidden)}>
                                        {comment.isHidden ? t("showComment") : t("hideComment")}
                                    </button>
                                    <DangerousButton className="rounded-md bg-bg-light px-3 py-2 text-sm text-text-content hover:bg-bg-hover"
                                                     onClick={() => deleteComment(comment.uid)}>
                                        {t("deleteComment")}
                                    </DangerousButton>
                                    <DangerousButton className="rounded-md bg-bg-light px-3 py-2 text-sm text-text-content hover:bg-bg-hover"
                                                     onClick={() => deleteGuest(user.uid)}>
                                        {t("deleteGuest")}
                                    </DangerousButton>
                                </p>
                            </div>
                        </Paper>
                    );
                })}
            </div>
            {total > 1 && (
                <div className="flex justify-center gap-6 items-center">
                    {page > 1 ? (
                        <button
                            className="w-24 text-text-content bg-bg-light text-sm p-2 rounded-lg hover:text-link-hover"
                            onClick={() => setPage(page - 1)}>
                            {t("prev")}
                        </button>
                    ) : (
                        <div className="w-24 px-3 py-2"/>
                    )}
                    <div>{page} / {total}</div>
                    {page < total ? (
                        <button
                            className="w-24 text-text-content bg-bg-light text-sm p-2 rounded-lg hover:text-link-hover"
                            onClick={() => setPage(page + 1)}>
                            {t("next")}
                        </button>
                    ) : (
                        <div className="w-24 px-3 py-2"/>
                    )}
                </div>
            )}
        </main>
    );
}

export default CommentsManager;
