import UpdateServerUrl from "@/app/(admin)/admin/UpdateServerUrl";
import Container from "@/components/base/Container";
import AppFooter from "@/components/layout/footer/AppFooter";
import {getDynamicConfig} from "@/lib/config";
import {ReactNode, Suspense} from "react";
import {getTranslations} from "next-intl/server";

export async function generateMetadata() {
    const {site} = await getDynamicConfig();
    const t = await getTranslations("page.admin.home.metadata");
    return {
        title: t("title", {siteName: site.title}),
        description: t("description", {siteName: site.title, siteDescription: site.description}),
    };
}

interface AdminRootLayoutProps {
    left: ReactNode;
    children: ReactNode;
}

async function AdminRootLayout({left, children}: AdminRootLayoutProps) {
    const dynamicConfig = await getDynamicConfig();

    return (
        <>
            <Container component="main"
                       className="row-start-2 md:grid mx-0 md:gap-x-6 md:grid-cols-3 md:px-6 xl:grid-cols-4 pt-6 w-full">
                <Suspense>
                    {left}
                </Suspense>
                {children}
            </Container>
            <AppFooter className="row-start-3"/>
            <UpdateServerUrl url={dynamicConfig.site.url}/>
        </>
    );
}

export default AdminRootLayout;
