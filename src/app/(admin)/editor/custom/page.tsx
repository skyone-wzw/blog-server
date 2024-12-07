import CustomPageEditor from "@/components/custom-page-editor/CustomPageEditor";
import {getDynamicConfig} from "@/lib/config";
import {CustomPage} from "@/lib/custom-page";
import {getTranslations} from "next-intl/server";

export async function generateMetadata() {
    const {site} = await getDynamicConfig();
    const t = await getTranslations("page.admin.editor.custom-page.metadata-new");
    return {
        title: t("title", {siteName: site.title}),
        description: t("description", {siteName: site.title, siteDescription: site.description}),
    };
}

async function NewCustomPageEditorPage() {
    const date = new Date();
    const t = await getTranslations("page.admin.editor.custom-page");
    const page: CustomPage = {
        id: "",
        title: t("default.title"),
        slug: "",
        description: "",
        content: "",
        createdAt: date,
        updatedAt: date,
    };

    return <CustomPageEditor page={page} className="hidden lg:flex w-0"/>;
}

export default NewCustomPageEditorPage;
