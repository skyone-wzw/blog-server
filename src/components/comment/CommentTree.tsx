import Paper from "@/components/base/Paper";
import {FediverseCommentWithGuest} from "@/lib/comment";
import {CommentHASTRender} from "@/components/markdown/CommentHASTRender";
import {getDynamicConfig} from "@/lib/config";
import L from "@/lib/links";
import ClickToCopy from "@/components/tools/ClickToCopy";
import Link from "next/link";
import {ReactNode} from "react";
import ScrollToComment from "@/components/comment/ScrollToComment";
import AvatarTooltip from "@/components/comment/AvatarTooltip";
import {getFormatter, getTranslations} from "next-intl/server";
import {ImgWithViewer} from "@/components/tools/ImageWithViewer";

interface CommentTree extends FediverseCommentWithGuest {
    replies: Array<FediverseCommentWithGuest & { replyTarget: FediverseCommentWithGuest }>;
}

function buildCommentTree(comments: FediverseCommentWithGuest[]) {
    const allCommentMap = new Map<string, FediverseCommentWithGuest & { parent: string | null }>();
    const rootCommentMap = new Map<string, CommentTree>();
    const soured = comments.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    for (const comment of soured) {
        allCommentMap.set(comment.uid, {...comment, parent: null});
        if (comment.replyTo) {
            const parent = rootCommentMap.get(comment.replyTo);
            if (parent) {
                parent.replies.push({...comment, replyTarget: parent});
                allCommentMap.set(comment.uid, {...comment, parent: parent.uid});
            } else {
                let parent = allCommentMap.get(comment.replyTo);
                if (!parent) continue;
                const first = parent!;
                while (allCommentMap.get(parent!.parent ?? "")) {
                    parent = allCommentMap.get(parent!.parent ?? "");
                }
                const grandParent = rootCommentMap.get(parent?.uid ?? "");
                if (grandParent) {
                    grandParent.replies.push({...comment, replyTarget: first});
                    allCommentMap.set(comment.uid, {...comment, parent: grandParent.uid});
                }
            }
        } else {
            rootCommentMap.set(comment.uid, {
                ...comment,
                replies: [],
            });
        }
    }
    return Array.from(rootCommentMap.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

interface CommentItemProps {
    comment: FediverseCommentWithGuest;
    replyTarget?: FediverseCommentWithGuest,
    replies?: ReactNode;
}

async function CommentItem({comment, replies, replyTarget}: CommentItemProps) {
    const t = await getTranslations("comment.CommentItem");
    const formatter = await getFormatter();
    const user = comment.user;
    const isReply = !!comment.replyTo && !!replyTarget;
    const fallbackAvatar = (await getDynamicConfig()).options.gravatar;
    const now = Date.now();

    return (
        <div id={`fediverse-comment-${comment.id}`} className="flex flex-row flex-nowrap gap-2">
            <div>
                <AvatarTooltip fallbackAvatar={fallbackAvatar} guest={comment.user}/>
            </div>
            <div className="flex-grow w-0">
                <p>
                    <Link className="text-link-content hover:text-link-hover" rel="noopener noreferrer"
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
                {isReply && (
                    <p className="text-text-content text-sm">
                        {t.rich("replyTo", {
                            reply: (chunks) => (
                                <ScrollToComment target={`fediverse-comment-${replyTarget!.id}`}
                                                 className="hover:text-link-hover">
                                    {chunks}
                                </ScrollToComment>
                            ),
                            uid: replyTarget!.user.uid,
                        })}
                    </p>
                )}
                <p className="text-sm text-text-subnote">
                    {t("createdAt", {
                        time: now - comment.createdAt.getTime() > 7 * 24 * 60 * 60 * 1000
                            ? formatter.dateTime(comment.createdAt, "default")
                            : formatter.relativeTime(comment.createdAt),
                    })}
                </p>
                <div>
                    <CommentHASTRender ast={JSON.parse(comment.parsed)}/>
                </div>
                {comment.images.length > 0 && (
                    <div className="grid gap-2" style={{gridTemplateColumns: "repeat(auto-fit, minmax(128px, 1fr))"}}>
                        {comment.images.map((image, index) => (
                            <ImgWithViewer className="max-w-full aspect-square rounded shadow-sm object-cover"
                                           key={index} src={image.url} alt={`comment-image-${index}`}/>
                        ))}
                    </div>
                )}
                <p className="text-text-subnote text-sm mt-2">
                    <Link className="hover:text-link-hover" rel="noopener noreferrer"
                          target="_blank" href={comment.uid}>
                        {t("viewInFediverse")}
                    </Link>
                    <Link className="hover:text-link-hover ml-4" rel="noopener noreferrer"
                          target="_blank" href={comment.uid}>
                        {t("replyInFediverse")}
                    </Link>
                    <ClickToCopy text={comment.uid} successText="复制成功" className="hover:text-link-hover ml-4">
                        {t("copyLink")}
                    </ClickToCopy>
                </p>
                <div className="comment-reply">
                    {replies}
                </div>
            </div>
        </div>
    );
}

interface CommentTreeProps {
    articleSlug: string;
    comments: FediverseCommentWithGuest[];
}

async function CommentTree({articleSlug, comments}: CommentTreeProps) {
    const {site} = await getDynamicConfig();
    const t = await getTranslations("comment.CommentTree");
    const link = `${site.url}${L.fediverse.post(articleSlug)}`;
    const commentTree = buildCommentTree(comments);

    return (
        <Paper className="p-4 md:p-6 flex flex-col gap-y-3 md:gap-y-4">
            <p className="flex justify-start flex-row gap-4">
                <span className="text-text-subnote flex-grow">
                    {t("title", {count: comments.length})}
                </span>
                <span className="text-text-subnote flex-grow-0">{t("searchInFediverse")}</span>
            </p>
            <p className="flex justify-start items-center flex-row gap-4">
                <code
                    className="whitespace-nowrap flex-grow text-text-subnote bg-bg-tag px-1.5 py-0.5 overflow-auto break-keep rounded pk-scroll">
                    {link}
                </code>
                <ClickToCopy text={link} successText={t("copied")}
                             className="flex-shrink-0 rounded px-2 py-0.5 hover:bg-bg-tag">{t("copy")}</ClickToCopy>
            </p>
            <div className="h-0.5 bg-text-subnote"/>
            <ul className="space-y-4 mt-4">
                {commentTree.map(comment => {
                    const replies = comment.replies.length > 0 ? (
                        <ul className="space-y-4 mt-4">
                            {comment.replies.map(reply => (
                                <li key={reply.id}>
                                    <CommentItem comment={reply} replyTarget={reply.replyTarget}/>
                                </li>
                            ))}
                        </ul>
                    ) : null;
                    return (
                        <li key={comment.id}>
                            <CommentItem comment={comment} replies={replies}/>
                        </li>
                    );
                })}
                {commentTree.length === 0 && (
                    <li>
                        <p className="text-center">{t("noComments")}</p>
                    </li>
                )}
            </ul>
        </Paper>
    );
}

export default CommentTree;
