import ProfileEditor from "@/app/(admin)/admin/settings/profile/ProfileEditor";
import {getDynamicConfig} from "@/lib/config";

export async function generateMetadata() {
    const dynamicConfig = await getDynamicConfig();
    return {
        title: `个人资料 - ${dynamicConfig.site.title}`,
        description: `${dynamicConfig.site.description}`,
    };
}

async function AdminSettingsProfilePage() {
    const dynamicConfig = await getDynamicConfig();
    return (
        <main className="mb-6 col-start-2 col-span-full space-y-6">
            <ProfileEditor profile={dynamicConfig.profile}/>
        </main>
    );
}

export default AdminSettingsProfilePage;
