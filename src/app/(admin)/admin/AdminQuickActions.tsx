"use client";

import QuickAction, {QuickActionProps} from "@/components/admin/QuickAction";
import Paper from "@/components/base/Paper";
import {
    GenerateCoverAction,
    PreprocessArticleAction,
    PreprocessCommentAction,
    RemoveArticleCacheAction,
    RemoveCoverCacheAction,
    RemoveUnusedAssetsAction,
} from "@/lib/admin-actions";
import clsx from "clsx";
import {useTranslations} from "next-intl";

interface AdminQuickActionsProps {
    className?: string;
}

function AdminQuickActions({className}: AdminQuickActionsProps) {
    const t = useTranslations("page.admin.home.AdminQuickActions")
    const actions: QuickActionProps[] = [
        {
            name: t("RemoveUnusedAssetsAction.title"),
            description: t("RemoveUnusedAssetsAction.description"),
            action: RemoveUnusedAssetsAction,
        },
        {
            name: t("RemoveArticleCacheAction.title"),
            description: t("RemoveArticleCacheAction.description"),
            action: RemoveArticleCacheAction,
        },
        {
            name: t("PreprocessArticleAction.title"),
            description: t("PreprocessArticleAction.description"),
            action: PreprocessArticleAction,
        },
        {
            name: t("RemoveCoverCacheAction.title"),
            description: t("RemoveCoverCacheAction.description"),
            action: RemoveCoverCacheAction,
        },
        {
            name: t("GenerateCoverAction.title"),
            description: t("GenerateCoverAction.description"),
            action: GenerateCoverAction,
        },
        {
            name: t("PreprocessCommentAction.title"),
            description: t("PreprocessCommentAction.description"),
            action: PreprocessCommentAction,
        },
    ];

    return (
        <Paper className={clsx("p-4", className)}>
            <h2 className="mb-2 text-text-subnote">{t("title")}</h2>
            <div className="divide-y divide-bg-tag border-y border-bg-tag">
                {actions.map((action, index) => (
                    <QuickAction key={index} {...action}/>
                ))}
            </div>
        </Paper>
    );
}

export default AdminQuickActions;
