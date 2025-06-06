import AdminQuickActions from "@/app/(admin)/admin/AdminQuickActions";
import ArticleStatistic from "@/app/(admin)/admin/ArticleStatistic";
import AutoReload from "@/app/(admin)/admin/AutoReload";
import SystemUsage from "@/app/(admin)/admin/SystemUsage";
import L from "@/lib/links";
import {revalidatePath} from "next/cache";

async function AdminMainPage() {
    const reload = async () => {
        "use server";
        revalidatePath(L.admin(), "page");
    }

    return (
        <main className="mb-6 col-start-2 col-span-full gap-6 grid grid-cols-6">
            <SystemUsage className="lg:col-span-3 col-span-full"/>
            <ArticleStatistic className="lg:col-span-3 col-span-full"/>
            <AdminQuickActions className="col-start-1 col-span-full"/>
            <AutoReload reload={reload}/>
        </main>
    );
}

export default AdminMainPage;
