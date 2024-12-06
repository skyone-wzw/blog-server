"use client";

import {FediverseGuest} from "@/lib/comment";
import styles from "./AvatarTooltip.module.css";
import clsx from "clsx";
import Link from "next/link";
import {CommentHASTRender} from "@/components/markdown/CommentHASTRender";
import {useState} from "react";

interface AvatarTooltipProps {
    fallbackAvatar: string;
    guest: FediverseGuest;
}

function AvatarTooltip({fallbackAvatar, guest}: AvatarTooltipProps) {
    const [loadBannerError, setLoadBannerError] = useState(false);
    const [loadAvatarError, setLoadAvatarError] = useState(false);

    const onLoadBannerError = () => {
        setLoadBannerError(true);
    };
    const onLoadAvatarError = () => {
        setLoadAvatarError(true);
    };

    const avatar = (loadAvatarError ? fallbackAvatar : guest.avatar) ?? fallbackAvatar;

    return (
        <div className={styles.TooltipRoot}>
            <div className={clsx(styles.TooltipBox, "bg-bg-tag rounded-xl shadow")}>
                {guest.banner && (!loadBannerError) && (
                    <img
                        className="h-32 w-full object-cover bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-t-xl"
                        onError={onLoadBannerError} alt={`${guest.name} 的头像`} src={guest.banner}/>
                ) || (
                    <div
                        className="h-32 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-t-xl"/>
                )}
                <div className="flex flex-col items-center justify-center p-4 pt-6">
                    <Link href={guest.webUrl ?? guest.url} className="mt-2 text-xl font-medium text-text-main"
                          target="_blank" rel="noopener noreferrer">
                        {guest.name}
                    </Link>
                    {guest.summary && (
                        <div className="mt-2 text-xs text-text-subnote break-words">
                            <CommentHASTRender ast={JSON.parse(guest.summary)}/>
                        </div>
                    )}
                    <Link href={guest.webUrl ?? guest.url} className="mt-2 text-xs text-text-subnote"
                          target="_blank" rel="noopener noreferrer">
                        @{guest.uid}
                    </Link>
                </div>
            </div>
            <div className="w-14">
                <img className={clsx(styles.Avatar, "h-14 w-14 rounded-xl relative")} onError={onLoadAvatarError}
                     src={avatar} alt={`${guest.name} 的头像`} width={56} height={56}/>
            </div>
        </div>
    );
}

export default AvatarTooltip;
