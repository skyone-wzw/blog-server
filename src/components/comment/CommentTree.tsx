import Paper from "@/components/base/Paper";
import {FediverseCommentWithGuest} from "@/lib/comment";
import {CommentHASTRender} from "@/components/markdown/CommentHASTRender";
import {getDynamicConfig} from "@/lib/config";
import L from "@/lib/links";
import ClickToCopy from "@/components/tools/ClickToCopy";
import Link from "next/link";
import {FormatDate} from "@/components/tools/FormatDate";
import {ReactNode} from "react";
import ScrollToComment from "@/components/comment/ScrollToComment";
import AvatarTooltip from "@/components/comment/AvatarTooltip";

interface CommentTree extends FediverseCommentWithGuest {
    replies: Array<FediverseCommentWithGuest & { replyTarget: FediverseCommentWithGuest }>;
}

function buildCommentTree(comments: FediverseCommentWithGuest[]) {
    const allCommentMap = new Map<string, FediverseCommentWithGuest & {parent: string | null}>();
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
    const user = comment.user;
    const now = Date.now();
    const isReply = !!comment.replyTo && !!replyTarget;
    const fallbackAvatar = (await getDynamicConfig()).options.gravatar;

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
                    来自
                    <Link className="hover:text-link-hover" rel="noopener noreferrer"
                          target="_blank" href={user.webUrl ?? user.url}>
                        @{user.uid}
                    </Link>
                </p>
                {isReply && (
                    <p className="text-text-content text-sm">
                        回复
                        <ScrollToComment target={`fediverse-comment-${replyTarget!.id}`}
                                         className="hover:text-link-hover">
                            @{replyTarget!.user.uid}
                        </ScrollToComment>
                    </p>
                )}
                <p className="text-sm text-text-subnote">
                    评论于 <FormatDate now={now} timestamp={comment.createdAt.getTime()}/>
                </p>
                <div>
                    <CommentHASTRender ast={JSON.parse(comment.parsed)}/>
                </div>
                <p className="text-text-subnote text-sm mt-2">
                    <Link className="hover:text-link-hover" rel="noopener noreferrer"
                          target="_blank" href={comment.uid}>
                        详情
                    </Link>
                    <Link className="hover:text-link-hover ml-4" rel="noopener noreferrer"
                          target="_blank" href={comment.uid}>
                        回复
                    </Link>
                    <ClickToCopy text={comment.uid} successText="复制成功" className="hover:text-link-hover ml-4">
                        复制链接
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
    const link = `${site.url}${L.fediverse.post(articleSlug)}`;
    const commentTree = buildCommentTree(comments);

    return (
        <Paper className="p-4 md:p-6 flex flex-col gap-y-3 md:gap-y-4">
            <p className="flex justify-start flex-row gap-4">
                <span className="text-text-subnote flex-grow">
                    {comments.length > 0 ? `${comments.length} 条来自联邦宇宙的回应` : "这里还没有评论~"}
                </span>
                <span className="text-text-subnote flex-grow-0">在联邦宇宙中搜索</span>
            </p>
            <p className="flex justify-start items-center flex-row gap-4">
                <code
                    className="whitespace-nowrap flex-grow text-text-subnote bg-bg-tag px-1.5 py-0.5 overflow-auto break-keep rounded pk-scroll">
                    {link}
                </code>
                <ClickToCopy text={link} successText="成功"
                             className="flex-shrink-0 rounded px-2 py-0.5 hover:bg-bg-tag">复制</ClickToCopy>
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
                        <p className="text-center">快通过联邦宇宙发表你的第一条评论吧！</p>
                    </li>
                )}
            </ul>
        </Paper>
    );
}

export default CommentTree;
