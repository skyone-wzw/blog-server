import CustomPageEditor from "@/components/custom-page-editor/CustomPageEditor";
import {getDynamicConfig} from "@/lib/config";
import {CustomPage} from "@/lib/custom-page";

export async function generateMetadata() {
    const dynamicConfig = await getDynamicConfig();
    return {
        title: `新建自定义页面 - ${dynamicConfig.site.title}`,
        description: dynamicConfig.site.description,
    };
}

function NewCustomPageEditorPage() {
    const date = new Date();
    const page: CustomPage = {
        id: "",
        title: "",
        slug: "",
        description: "",
        content: "",
        createdAt: date,
        updatedAt: date,
    };

    return <CustomPageEditor page={page} className="flex w-0"/>;
}

export default NewCustomPageEditorPage;
