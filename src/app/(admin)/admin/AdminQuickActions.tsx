"use client";

import QuickAction, {QuickActionProps} from "@/components/admin/QuickAction";
import Paper from "@/components/base/Paper";
import {RemoveUnusedAssetsAction} from "@/lib/admin-actions";
import clsx from "clsx";

interface AdminQuickActionsProps {
    className?: string;
}

function AdminQuickActions({className}: AdminQuickActionsProps) {
    const actions: QuickActionProps[] = [
        {
            name: "清理图片",
            description: "清理所有已上传但没有被文章引用的图片",
            action: RemoveUnusedAssetsAction,
        },
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
