"use client";

import {QuickActionResult} from "@/lib/admin-actions";
import clsx from "clsx";
import {useState} from "react";
import {useTranslations} from "next-intl";

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

export interface QuickActionProps {
    name: string;
    description?: string;
    action: () => Promise<QuickActionResult> | QuickActionResult;
}

function QuickAction({name, description, action}: QuickActionProps) {
    const [loading, setLoading] = useState(false);
    const t = useTranslations("admin.QuickAction");

    return (
        <div className="flex flex-col justify-start items-start lg:items-center lg:flex-row p-2 gap-2">
            <div className="basis-0 grow">
                <p className="text-text-content">{name}</p>
                <p className="text-sm text-text-subnote grow">{description}</p>
            </div>
            <button
                className="self-end rounded-md bg-button-bg px-4 py-2 text-sm text-button-text shadow-xs hover:bg-button-hover disabled:bg-bg-hover"
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
                {t("execute")}
            </button>
        </div>
    );
}

export default QuickAction;
