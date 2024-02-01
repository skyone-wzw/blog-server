import AppHeader from "@/components/layout/header/AppHeader";
import config from "@/config";
import {getDynamicConfig} from "@/lib/config";
import clsx from "clsx";
import type {Metadata} from "next";
import {Inter} from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import {ReactNode} from "react";
import "./globals.css";

const inter = Inter({subsets: ["latin"]});

export async function generateMetadata(): Promise<Metadata> {
    const dynamicConfig = await getDynamicConfig();

    return {
        metadataBase: new URL(dynamicConfig.site.url),
        title: dynamicConfig.site.title,
        description: dynamicConfig.site.description,
        authors: [
            {
                name: dynamicConfig.profile.name,
            },
        ],
        keywords: dynamicConfig.site.keywords,
        alternates: {
            canonical: "/",
        },
        archives: `${dynamicConfig.site.url}/archive`,
        openGraph: {
            type: "website",
            title: dynamicConfig.site.title,
            description: dynamicConfig.site.description,
            emails: dynamicConfig.profile.email ? [dynamicConfig.profile.email] : undefined,
            siteName: dynamicConfig.site.title,
            locale: "zh_CN",
            url: "/",
            images: [
                {
                    url: dynamicConfig.site.cover,
                    width: 1300,
                    height: 630,
                    alt: "cover",
                },
            ],
        },
    };
}

const bootloader = `!function(){var t=localStorage.getItem("pattern.mode"),a=document.documentElement.classList;"light"===t?a.add("light"):"dark"===t&&a.add("dark")}();`;

interface RootLayoutProps {
    children: ReactNode;
}

function RootLayout({children}: RootLayoutProps) {
    return (
        <html lang="zh-CN">
            <head>
                <link rel="icon" href={"/favicon"} sizes="any"/>
                <script dangerouslySetInnerHTML={{__html: bootloader}}/>
            </head>
            <body className={clsx(inter.className, "pk-scroll", {"color-transition": config.theme.colorTransition})}>
                <NextTopLoader color="#ec4899"/>
                <AppHeader className="row-start-1"/>
                {children}
            </body>
        </html>
    );
}

export default RootLayout;
