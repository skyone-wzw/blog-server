"use client";

import {ReactNode, useEffect} from "react";

interface NoScrollProps {
    children: ReactNode;
}

function NoScroll({children}: NoScrollProps) {
    useEffect(() => {
        document.documentElement.style.overflow = "hidden";
        return () => {
            document.documentElement.style.overflow = "";
        };
    }, []);

    return <>{children}</>;
}

export default NoScroll;
