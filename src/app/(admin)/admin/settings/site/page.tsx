import {getDynamicConfig} from "@/lib/config";
import SiteEditor from "./SiteEditor";

export async function generateMetadata() {
    const dynamicConfig = await getDynamicConfig();
    return {
        title: `网站配置 - ${dynamicConfig.site.title}`,
        description: `${dynamicConfig.site.description}`,
    };
}

async function AdminSettingsSitePage() {
    const dynamicConfig = await getDynamicConfig();
    return (
        <main className="mb-6 col-start-2 col-span-full space-y-6">
            <SiteEditor site={dynamicConfig.site}/>
        </main>
    );
}

export default AdminSettingsSitePage;
