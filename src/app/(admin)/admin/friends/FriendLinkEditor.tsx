"use client";

import Dialog from "@/components/base/Dialog";
import Paper from "@/components/base/Paper";
import DangerousButton from "@/components/DangerousButton";
import {Friend, FriendCreate, FriendPatch} from "@/lib/friends";
import {CreateFriendAction, DeleteFriendAction, SaveFriendAction} from "@/lib/friends-actions";
import clsx from "clsx";
import {FormEventHandler, MouseEventHandler, ReactNode, useEffect, useState} from "react";

interface FriendLinkEditorDialogProps {
    open: boolean;
    onClose: () => void;
    friend?: Friend;
    className?: string;
}

function FriendLinkEditorDialog({open, onClose, friend, className}: FriendLinkEditorDialogProps) {
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [avatar, setAvatar] = useState("");
    const [siteName, setSiteName] = useState("");
    const [siteUrl, setSiteUrl] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        if (friend) {
            setName(friend.name);
            setEmail(friend.email || "");
            setAvatar(friend.avatar || "");
            setSiteName(friend.siteName);
            setSiteUrl(friend.siteUrl);
            setDescription(friend.description);
        } else {
            setName("");
            setEmail("");
            setAvatar("");
            setSiteName("");
            setSiteUrl("");
            setDescription("");
        }
    }, [friend]);

    const handleSave: FormEventHandler = async (e) => {
        e.preventDefault();
        if (!name) {
            alert("名称不能为空");
            return;
        }
        if (!siteName) {
            alert("网站名称不能为空");
            return;
        }
        if (!siteUrl) {
            alert("网站链接不能为空");
            return;
        }
        if (friend) {
            const friendPatch: FriendPatch = {
                id: friend.id,
            };
            if (name !== friend.name) friendPatch.name = name;
            if (email !== friend.email) friendPatch.email = email;
            if (avatar !== friend.avatar) friendPatch.avatar = avatar;
            if (siteName !== friend.siteName) friendPatch.siteName = siteName;
            if (siteUrl !== friend.siteUrl) friendPatch.siteUrl = siteUrl;
            if (description !== friend.description) friendPatch.description = description;
            if (Object.keys(friendPatch).length === 1) {
                onClose();
                return;
            }
            setLoading(true);
            const result = await SaveFriendAction(friendPatch);
            setLoading(false);
            if (result) {
                onClose();
            } else {
                alert("创建失败");
            }
        } else {
            const friendCreate: FriendCreate = {
                name,
                email,
                avatar,
                siteName,
                siteUrl,
                description,
            };
            setLoading(true);
            const result = await CreateFriendAction(friendCreate);
            setLoading(false);
            if (result) {
                onClose();
            } else {
                alert("创建失败");
            }
        }
    };

    return (
        <Dialog open={open} onClose={onClose} blur className={className}>
            <form
                onSubmit={handleSave}
                className="bg-bg-light rounded-lg shadow p-4 max-w-full max-h-[90vh] w-[480px] lg:w-[640px] overflow-y-auto xc-scroll flex flex-col gap-y-2">
                <div className="pb-4 text-text-main">编辑信息</div>
                <div className="w-full">
                    <label htmlFor="friend-link-editor-info-name"
                           className="block text-sm font-medium leading-6 text-text-content">
                        名称
                    </label>
                    <div className="mt-2">
                        <input id="friend-link-editor-info-name" type="text" required value={name}
                               onChange={(e) => setName(e.target.value)}
                               className="block w-full text-sm shadow appearance-none border rounded py-2 px-3 bg-bg-light text-text-content focus:outline-none focus:shadow-link-content focus:border-link-content"/>
                    </div>
                </div>
                <div className="w-full">
                    <label htmlFor="friend-link-editor-info-email"
                           className="block text-sm font-medium leading-6 text-text-content">
                        邮箱
                    </label>
                    <div className="mt-2">
                        <input id="friend-link-editor-info-email" type="email" value={email}
                               onChange={(e) => setEmail(e.target.value)}
                               className="block w-full text-sm shadow appearance-none border rounded py-2 px-3 bg-bg-light text-text-content focus:outline-none focus:shadow-link-content focus:border-link-content"/>
                    </div>
                </div>
                <div className="w-full">
                    <label htmlFor="friend-link-editor-info-avatar"
                           className="block text-sm font-medium leading-6 text-text-content">
                        头像
                    </label>
                    <div className="mt-2">
                        <input id="friend-link-editor-info-avatar" type="url" value={avatar}
                               onChange={(e) => setAvatar(e.target.value)}
                               className="block w-full text-sm shadow appearance-none border rounded py-2 px-3 bg-bg-light text-text-content focus:outline-none focus:shadow-link-content focus:border-link-content"/>
                    </div>
                </div>
                <div className="w-full">
                    <label htmlFor="friend-link-editor-info-site-name"
                           className="block text-sm font-medium leading-6 text-text-content">
                        网站名称
                    </label>
                    <div className="mt-2">
                        <input id="friend-link-editor-info-site-name" type="text" required value={siteName}
                               onChange={(e) => setSiteName(e.target.value)}
                               className="block w-full text-sm shadow appearance-none border rounded py-2 px-3 bg-bg-light text-text-content focus:outline-none focus:shadow-link-content focus:border-link-content"/>
                    </div>
                </div>
                <div className="w-full">
                    <label htmlFor="friend-link-editor-info-site-url"
                           className="block text-sm font-medium leading-6 text-text-content">
                        网站链接
                    </label>
                    <div className="mt-2">
                        <input id="friend-link-editor-info-site-url" type="url" required value={siteUrl}
                               onChange={(e) => setSiteUrl(e.target.value)}
                               className="block w-full text-sm shadow appearance-none border rounded py-2 px-3 bg-bg-light text-text-content focus:outline-none focus:shadow-link-content focus:border-link-content"/>
                    </div>
                </div>
                <div className="w-full">
                    <label htmlFor="friend-link-editor-info-description"
                           className="block text-sm font-medium leading-6 text-text-content">
                        简要概述
                    </label>
                    <div className="mt-2">
                        <input id="friend-link-editor-info-site-url" type="text" required value={description}
                               onChange={(e) => setDescription(e.target.value)}
                               className="block w-full text-sm shadow appearance-none border rounded py-2 px-3 bg-bg-light text-text-content focus:outline-none focus:shadow-link-content focus:border-link-content"/>
                    </div>
                </div>
                <div className="flex flex-row mt-2 gap-4">
                    <input
                        className="w-0 grow rounded-md bg-button-bg px-3 py-2 text-sm text-button-text shadow-sm hover:bg-button-hover disabled:bg-bg-hover"
                        type="submit" disabled={loading} value="保存"/>
                    <button
                        className="w-0 grow rounded-md outline outline-bg-tag outline-1 px-3 py-2 text-sm text-text-content shadow-sm hover:bg-bg-hover"
                        type="button" disabled={loading} onClick={onClose}>
                        取消
                    </button>
                </div>
            </form>
        </Dialog>
    );
}

interface FriendLinkEditorProps {
    friend: Friend;
    className?: string;
    avatarElement?: ReactNode;
}

export function FriendLinkEditor({friend, className, avatarElement}: FriendLinkEditorProps) {
    const [open, setOpen] = useState(false);

    const handleDeleteFriendLink = async () => {
        const result = await DeleteFriendAction(friend.id);
        if (!result) {
            alert("删除失败");
        }
    };

    return (
        <Paper
            className={clsx("hover:bg-bg-hover outline outline-1 outline-bg-quote", className)}>
            <div className="flex flex-row items-center select-none" onClick={() => setOpen(true)}>
                <div className="aspect-square">
                    {avatarElement}
                </div>
                <div className="p-2 w-0 grow">
                    <p className="text-text-content text-ellipsis whitespace-nowrap break-all overflow-hidden">
                        {friend.siteName}&nbsp;
                    </p>
                    <p className="text-sm text-text-subnote text-ellipsis whitespace-nowrap break-all overflow-hidden">
                        {friend.description}&nbsp;
                    </p>
                </div>
                <DangerousButton
                    className="p-2 mx-2 rounded-md outline outline-button-bg outline-1 px-3 py-2 text-sm text-text-content"
                    onClick={handleDeleteFriendLink}>
                    删除友链
                </DangerousButton>
            </div>
            <FriendLinkEditorDialog open={open} onClose={() => setOpen(false)} friend={friend}/>
        </Paper>
    );
}

interface IconProps {
    className?: string;
}

function AddIcon({className}: IconProps) {
    return (
        <svg fill="currentColor" viewBox="0 0 24 24" height="32" width="32"
             className={className}
             xmlns="http://www.w3.org/2000/svg">
            <path fill="none" d="M0 0h24v24H0V0z"></path>
            <path
                d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path>
        </svg>
    );
}

interface FriendLinkCreatorProps {
    className?: string;
}

export function FriendLinkCreator({className}: FriendLinkCreatorProps) {
    const [open, setOpen] = useState(false);
    const handleClose: MouseEventHandler = (e) => {
        e.stopPropagation();
        setOpen(true);
    };

    return (
        <div>
            <Paper
                onClick={handleClose}
                className={clsx("p-4 flex flex-row justify-center items-center hover:bg-bg-hover outline outline-1 outline-bg-quote", className)}>
                <span className="mr-2 text-lg select-none">添加友链</span>
                <AddIcon/>
            </Paper>
            <FriendLinkEditorDialog open={open} onClose={() => setOpen(false)}/>
        </div>
    );
}
