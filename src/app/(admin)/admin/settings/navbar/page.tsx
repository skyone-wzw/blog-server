import NavbarEditor from "@/app/(admin)/admin/settings/navbar/NavbarEditor";
import {getDynamicConfig} from "@/lib/config";

export async function generateMetadata() {
    const dynamicConfig = await getDynamicConfig();
    return {
        title: `导航栏 - ${dynamicConfig.site.title}`,
        description: `${dynamicConfig.site.description}`,
    };
}

async function AdminSettingsNavbarPage() {
    const dynamicConfig = await getDynamicConfig();
    return (
        <main className="mb-6 col-start-2 col-span-full space-y-6">
            <NavbarEditor navbar={dynamicConfig.navbar}/>
        </main>
    );
}

export default AdminSettingsNavbarPage;
