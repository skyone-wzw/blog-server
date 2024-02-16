"use client";

import QuickAction, {QuickActionProps} from "@/components/admin/QuickAction";
import {RemoveUnusedAssetsAction} from "@/lib/admin-actions";

interface AssetsQuickActionsProps {
    className?: string;
}

function ImageAssetsQuickActions({className}: AssetsQuickActionsProps) {
    const actions: QuickActionProps[] = [
        {
            name: "清理图片",
            description: "清理所有已上传但没有被文章引用的图片",
            action: RemoveUnusedAssetsAction,
        },
    ];

    return (
        <div className={className}>
            {actions.map((action, index) => (
                <QuickAction key={index} {...action}/>
            ))}
        </div>
    );
}

export default ImageAssetsQuickActions;
