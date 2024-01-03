"use client";

import {ReactNode, useEffect, useRef, useState} from "react";

interface DangerousButtonProps {
    className?: string;
    children: ReactNode;
    onClick: () => void;
}

function DangerousButton({className, children, onClick}: DangerousButtonProps) {
    const ref = useRef<HTMLButtonElement>(null);
    const [isConfirm, setIsConfirm] = useState(false);

    useEffect(() => {
        if (isConfirm) {
            // 如果 3 秒内没有点击按钮，就自动取消
            const timer = setTimeout(() => {
                setIsConfirm(false);
            }, 3000);

            // 如果点击了按钮之外的地方，就自动取消
            const handleClick = (event: MouseEvent) => {
                if (ref.current && !ref.current.contains(event.target as Node)) {
                    setIsConfirm(false);
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
            onClick();
            setIsConfirm(false);
        } else {
            setIsConfirm(true);
        }
    };

    return (
        <button
            className={className}
            onClick={handleClick} ref={ref}>
            {isConfirm ? "确认吗？" : children}
        </button>
    );
}

export default DangerousButton;
