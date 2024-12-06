import FediverseEditor from "@/app/(admin)/admin/settings/fediverse/FediverseEditor";
import {getDynamicConfig} from "@/lib/config";

export async function generateMetadata() {
    const dynamicConfig = await getDynamicConfig();
    return {
        title: `联邦 - ${dynamicConfig.site.title}`,
        description: `${dynamicConfig.site.description}`,
    };
}

async function AdminSettingsFediversePage() {
    const dynamicConfig = await getDynamicConfig();
    return (
        <main className="mb-6 col-start-2 col-span-full space-y-6">
            <FediverseEditor fediverse={dynamicConfig.fediverse}/>
        </main>
    );
}

export default AdminSettingsFediversePage;
