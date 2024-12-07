import CustomPageEditor from "@/components/custom-page-editor/CustomPageEditor";
import {getDynamicConfig} from "@/lib/config";
import {getCustomPageBySlug} from "@/lib/custom-page";
import {notFound} from "next/navigation";
import {getTranslations} from "next-intl/server";

interface CustomPageEditorPageProps {
    params: {
        paths: string[];
    };
}

export const generateMetadata = async ({params}: CustomPageEditorPageProps) => {
    const paths = (await params).paths.map(decodeURIComponent);
    const slug = "/" + paths.join("/");
    const t = await getTranslations("page.admin.editor.custom-page.metadata");
    const dynamicConfig = await getDynamicConfig();
    const customPage = await getCustomPageBySlug(slug);

    return {
        title: t("title", {siteName: dynamicConfig.site.title, title: customPage?.title}),
        description: t("description", {
            siteName: dynamicConfig.site.title,
            siteDescription: dynamicConfig.site.description,
            title: customPage?.title,
        }),
    };
};

async function CustomPageEditorPage({params}: CustomPageEditorPageProps) {
    const paths = (await params).paths.map(decodeURIComponent);
    const slug = "/" + paths.join("/");
    const customPage = await getCustomPageBySlug(slug);

    if (!customPage) return notFound();

    return <CustomPageEditor page={customPage} className="flex"/>;
}

export default CustomPageEditorPage;
