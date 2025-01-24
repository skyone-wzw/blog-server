"use client";

import clsx from "clsx";
import {MouseEventHandler, ReactNode, useEffect, useRef, useState} from "react";
import {useTranslations} from "next-intl";

interface DangerousButtonProps {
    disabled?: boolean;
    className?: string;
    confirmText?: string;
    children: ReactNode;
    onClick: () => void;
}

function DangerousButton({disabled, className, confirmText, children, onClick}: DangerousButtonProps) {
    const ref = useRef<HTMLButtonElement>(null);
    const [isConfirm, setIsConfirm] = useState(0);
    const t = useTranslations("DangerousButton");

    useEffect(() => {
        if (isConfirm) {
            // 如果 3 秒内没有点击按钮，就自动取消
            const timer = setTimeout(() => {
                setIsConfirm(0);
            }, 3000);

            // 如果点击了按钮之外的地方，就自动取消
            const handleClick = (event: MouseEvent) => {
                if (ref.current && !ref.current.contains(event.target as Node)) {
                    setIsConfirm(0);
                }
            };
            window.addEventListener("click", handleClick);

            return () => {
                clearTimeout(timer);
                window.removeEventListener("click", handleClick);
            };
        }
    }, [isConfirm]);

    const handleClick: MouseEventHandler = (e) => {
        e.stopPropagation();
        if (isConfirm) {
            if (Date.now() - isConfirm < 200) {
                // 点击间隔小于 200ms, 可能为误触, 不执行
                return;
            }
            onClick();
            setIsConfirm(0);
        } else {
            setIsConfirm(Date.now());
        }
    };

    return (
        <button
            type="button"
            className={clsx({
                "bg-red-500 hover:bg-red-600 text-button-text": isConfirm !== 0,
            }, className)}
            disabled={disabled}
            onClick={handleClick} ref={ref}>
            {isConfirm !== 0 ? (confirmText ?? t("confirm")) : children}
        </button>
    );
}

export default DangerousButton;
