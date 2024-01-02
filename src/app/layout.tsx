import AppHeader from "@/components/layout/header/AppHeader";
import config from "@/config";
import clsx from "clsx";
import type {Metadata} from "next";
import {Inter} from "next/font/google";
import {ReactNode} from "react";
import "./globals.css";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    metadataBase: new URL(config.url),
    title: config.title,
    description: config.description,
    authors: [
        {
            name: config.master.name,
        },
    ],
    keywords: config.keywords,
    alternates: {
        canonical: "/",
    },
    archives: `${config.url}/archive`,
    openGraph: {
        type: "website",
        title: config.title,
        description: config.description,
        emails: config.master.email ? [config.master.email] : undefined,
        siteName: config.title,
        locale: "zh_CN",
        url: "/",
        images: [
            {
                url: config.cover,
                width: 1300,
                height: 630,
                alt: "cover",
            },
        ],
    },
};

const bootloader = `!function(){var t=localStorage.getItem("pattern.mode"),a=document.documentElement.classList;"light"===t?a.add("light"):"dark"===t&&a.add("dark")}();`;

interface RootLayoutProps {
    children: ReactNode;
}

function RootLayout({children}: RootLayoutProps) {
    return (
        <html lang="zh-CN">
            <head>
                <script dangerouslySetInnerHTML={{__html: bootloader}}/>
            </head>
            <body className={clsx(inter.className, "pk-scroll")}>
                <AppHeader/>
                {children}
            </body>
        </html>
    );
}

export default RootLayout;
