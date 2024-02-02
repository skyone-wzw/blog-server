import CustomPageEditor from "@/components/custom-page-editor/CustomPageEditor";
import {getDynamicConfig} from "@/lib/config";
import {getCustomPageBySlug} from "@/lib/custom-page";
import {notFound} from "next/navigation";

interface CustomPageEditorPageProps {
    params: {
        paths: string[];
    };
}

export const generateMetadata = async ({params}: CustomPageEditorPageProps) => {
    const paths = params.paths.map(decodeURIComponent);
    const slug = "/" + paths.join("/");
    const dynamicConfig = await getDynamicConfig();
    const customPage = await getCustomPageBySlug(slug);

    return {
        title: `编辑: ${customPage?.title} - ${dynamicConfig.site.title}`,
        description: dynamicConfig.site.description,
    };
};

async function CustomPageEditorPage({params}: CustomPageEditorPageProps) {
    const paths = params.paths.map(decodeURIComponent);
    const slug = "/" + paths.join("/");
    const customPage = await getCustomPageBySlug(slug);

    if (!customPage) return notFound();

    return <CustomPageEditor page={customPage} className="flex"/>;
}

export default CustomPageEditorPage;
