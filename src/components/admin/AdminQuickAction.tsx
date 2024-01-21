"use client";

import Paper from "@/components/base/Paper";
import {QuickActionResult, RemoveUnusedAssetsAction} from "@/lib/admin-actions";
import clsx from "clsx";
import {useState} from "react";

interface IconProps {
    className?: string;
}

function RunIcon({className}: IconProps) {
    return (
        <svg className={clsx("inline", className)} fill="currentColor" viewBox="0 0 512 512" height="16px" width="16px"
             xmlns="http://www.w3.org/2000/svg">
            <path
                d="M371.7 238l-176-107c-15.8-8.8-35.7 2.5-35.7 21v208c0 18.4 19.8 29.8 35.7 21l176-101c16.4-9.1 16.4-32.8 0-42zM504 256C504 119 393 8 256 8S8 119 8 256s111 248 248 248 248-111 248-248zm-448 0c0-110.5 89.5-200 200-200s200 89.5 200 200-89.5 200-200 200S56 366.5 56 256z"></path>
        </svg>
    );
}

interface QuickActionItemProps {
    name: string;
    description?: string;
    action: () => Promise<QuickActionResult> | QuickActionResult;
}

function QuickActionItem({name, description, action}: QuickActionItemProps) {
    const [loading, setLoading] = useState(false);

    return (
        <div className="flex flex-col justify-start items-start lg:items-center lg:flex-row p-2 gap-y-2">
            <span className="text-text-content">{name}</span>
            <span className="text-sm lg:ml-2 lg:mt-1 text-text-subnote grow">{description}</span>
            <button
                className="self-end rounded-md bg-button-bg px-4 py-2 text-sm text-button-text shadow-sm hover:bg-button-hover disabled:bg-bg-hover"
                disabled={loading} type="button"
                onClick={async () => {
                    setLoading(true);
                    const result = await action();
                    setLoading(false);
                    if (result.success) {
                        alert(result.message);
                    } else {
                        alert(result.message);
                    }
                }}>
                <RunIcon className="mr-2"/>
                执行
            </button>
        </div>
    );
}

interface AdminQuickActionProps {
    className?: string;
}

function AdminQuickAction({className}: AdminQuickActionProps) {
    const actions: QuickActionItemProps[] = [
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
                    <QuickActionItem key={index} {...action}/>
                ))}
            </div>
        </Paper>
    );
}

export default AdminQuickAction;
