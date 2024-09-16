"use client";

import {UpdateServerUrlAction} from "@/lib/config-actions";
import {useEffect} from "react";

interface UpdateServerUrlProps {
    url: string;
}

function UpdateServerUrl({url}: UpdateServerUrlProps) {
    useEffect(() => {
        const _url = new URL(window.location.href);
        const currentUrl = `${_url.protocol}//${_url.host}`;
        if (currentUrl !== url) {
            UpdateServerUrlAction(currentUrl)
                .then(ok => {
                    if (ok) {
                        console.debug("Server URL updated successfully: ", currentUrl);
                    } else {
                        console.error("Failed to update server URL: ", currentUrl);
                        console.error("Server current URL: ", url);
                    }
                });
        }
    }, [url]);

    return null;
}

export default UpdateServerUrl;
