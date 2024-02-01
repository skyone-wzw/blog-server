import AdminQuickAction from "@/components/admin/AdminQuickAction";
import {getDynamicConfig} from "@/lib/config";

export async function generateMetadata() {
    const dynamicConfig = await getDynamicConfig();
    return {
        title: `管理面板 - ${dynamicConfig.site.title}`,
        description: `${dynamicConfig.site.description}`,
    }
}

async function AdminMainPage() {
    return (
        <main className="mb-6 col-start-2 col-span-full space-y-6">
            <AdminQuickAction/>
        </main>
    );
}

export default AdminMainPage;
