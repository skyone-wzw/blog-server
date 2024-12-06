"use client";

import {HTMLAttributes, useState} from "react";

interface ClickToCopyProps extends HTMLAttributes<HTMLButtonElement> {
    text: string;
    successText?: string;
}

function ClickToCopy({text, successText, children, className, ...other}: ClickToCopyProps) {
    const [showSuccess, setShowSuccess] = useState(false);
    successText = successText || "复制成功";

    const handleClick = () => {
        navigator.clipboard?.writeText(text).then(() => {
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 1000);
        });
    };
    return (
        <button onClick={handleClick} className={className} {...other}>
            {showSuccess ? successText : children}
        </button>
    );
}

export default ClickToCopy;
