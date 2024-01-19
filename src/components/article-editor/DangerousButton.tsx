"use client";

import clsx from "clsx";
import {ReactNode, useEffect, useRef, useState} from "react";

interface DangerousButtonProps {
    className?: string;
    children: ReactNode;
    onClick: () => void;
}

function DangerousButton({className, children, onClick}: DangerousButtonProps) {
    const ref = useRef<HTMLButtonElement>(null);
    const [isConfirm, setIsConfirm] = useState(0);

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

    const handleClick = () => {
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
            className={clsx(className, {
                "bg-red-500 hover:bg-red-600": isConfirm !== 0,
            })}
            onClick={handleClick} ref={ref}>
            {isConfirm !== 0 ? "确认吗？" : children}
        </button>
    );
}

export default DangerousButton;
