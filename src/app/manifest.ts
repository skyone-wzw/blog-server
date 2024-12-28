import {getDynamicConfig} from "@/lib/config";
import type {MetadataRoute} from "next";

async function manifest(): Promise<MetadataRoute.Manifest> {
    const {site} = await getDynamicConfig();
    return {
        name: site.title,
        short_name: site.title,
        description: site.description,
        start_url: "/",
        display: "standalone",
        background_color: "#fff",
        theme_color: "#fff",
        icons: [
            {
                src: "/favicon.ico",
                sizes: "64x64",
                type: "image/png",
            },
        ],
    };
}

export default manifest;
