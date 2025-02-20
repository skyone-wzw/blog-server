import ColorModeProvider from "@/components/ColorModeProvider";
import AppHeader from "@/components/layout/header/AppHeader";
import config from "@/config";
import {getDynamicConfig} from "@/lib/config";
import clsx from "clsx";
import type {Metadata} from "next";
import {Inter} from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import {ReactNode} from "react";
import "./globals.css";
import ImageViewerProvider from "@/components/image-viewer/ImageViewerProvider";
import {NextIntlClientProvider} from "next-intl";
import {getLocale, getMessages} from "next-intl/server";
import {formats} from "@/i18n/request";

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

interface RootLayoutProps {
    children: ReactNode;
}

async function RootLayout({children}: RootLayoutProps) {
    const locale = await getLocale();
    const messages = await getMessages();

    return (
        <html lang={locale}>
            <head>
                <link rel="sitemap" type="application/xml" title="Sitemap" href={"/sitemap.xml"}/>
            </head>
            <body className={clsx(inter.className, "pk-scroll", {"color-transition": config.theme.colorTransition})}>
                <ColorModeProvider>
                    <NextIntlClientProvider messages={messages} formats={formats}>
                        <ImageViewerProvider>
                            <NextTopLoader color="#ec4899"/>
                            <AppHeader className="row-start-1"/>
                            {children}
                        </ImageViewerProvider>
                    </NextIntlClientProvider>
                </ColorModeProvider>
            </body>
        </html>
    );
}

export default RootLayout;
