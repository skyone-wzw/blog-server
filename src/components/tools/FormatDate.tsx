"use client";

import {useEffect, useState} from "react";

export function formatDateEast8(date: Date) {
    return date.toLocaleString("zh-CN", {
        timeZone: "Asia/Shanghai",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
    });
}

export function formatDateLocal(date: Date) {
    return date.toLocaleString("zh-CN", {
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
    });
}

function formatRelateDate(now: Date, date: Date) {
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    if (diffInDays < 7) {
        const diffInHours = diffInMs / (1000 * 60 * 60);
        const diffInMinutes = diffInMs / (1000 * 60);
        const diffInSeconds = diffInMs / 1000;

        if (diffInDays >= 1) {
            return `${Math.floor(diffInDays)}天前`;
        } else if (diffInHours >= 1) {
            return `${Math.floor(diffInHours)}小时前`;
        } else if (diffInMinutes >= 1) {
            return `${Math.floor(diffInMinutes)}分钟前`;
        } else {
            return `${Math.floor(diffInSeconds)}秒前`;
        }
    }
}

interface FormatDateProps {
    now?: number;
    timestamp: number;
}

export function FormatDate({now, timestamp}: FormatDateProps) {
    const date = new Date(timestamp);
    const [local, setLocal] = useState(false);

    // 防止因时区问题导致 Next.js 水和错误
    useEffect(() => {
        setLocal(true);
    }, []);

    const relate = now ? formatRelateDate(new Date(now), date) : null;

    return (
        <time dateTime={date.toISOString()}>
            {relate || (local ? formatDateLocal(date) : formatDateEast8(date))}
        </time>
    );
}
