"use client";

import QuickAction, {QuickActionProps} from "@/components/admin/QuickAction";
import Paper from "@/components/base/Paper";
import {
    GenerateCoverAction,
    PreprocessArticleAction,
    RemoveArticleCacheAction,
    RemoveCoverCacheAction,
    RemoveUnusedAssetsAction,
} from "@/lib/admin-actions";
import clsx from "clsx";

interface AdminQuickActionsProps {
    className?: string;
}

function AdminQuickActions({className}: AdminQuickActionsProps) {
    const actions: QuickActionProps[] = [
        {
            name: "清理图片",
            description: "清理所有已上传但没有被文章引用的图片。",
            action: RemoveUnusedAssetsAction,
        },
        {
            name: "清除文章缓存",
            description: "清除服务端的文章预编译缓存。缓存不会影响文章内容，并且会在下次访问时重新生成。",
            action: RemoveArticleCacheAction,
        },
        {
            name: "预热文章缓存",
            description: "预热所有文章的预编译缓存，以提高文章访问速度。此操作通常自动执行。",
            action: PreprocessArticleAction,
        },
        {
            name: "清除封面缓存",
            description: "清除文章封面的缓存。缓存会在下次访问时重新生成。",
            action: RemoveCoverCacheAction,
        },
        {
            name: "生成封面缓存",
            description: "预生成所有文章的封面。此操作通常自动执行。",
            action: GenerateCoverAction,
        }
    ];

    return (
        <Paper className={clsx("p-4", className)}>
            <h2 className="mb-2 text-text-subnote">快速操作</h2>
            <div className="divide-y divide-bg-tag border-y border-bg-tag">
                {actions.map((action, index) => (
                    <QuickAction key={index} {...action}/>
                ))}
            </div>
        </Paper>
    );
}

export default AdminQuickActions;
