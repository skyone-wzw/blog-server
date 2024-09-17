"use client";

import {useEffect} from "react";

interface AutoReloadProps {
    reload: () => Promise<void>;
}

function AutoReload({reload}: AutoReloadProps) {
    useEffect(() => {
        const token = setInterval(reload, 1000 * 2);
        return () => clearInterval(token);
    }, [reload]);

    return null;
}

export default AutoReload;
