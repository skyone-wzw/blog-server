import {isUserLoggedIn} from "@/lib/auth";
import L from "@/lib/links";
import {redirect, RedirectType} from "next/navigation";
import {ReactNode} from "react";

interface AdminPageLayoutProps {
    children: ReactNode;
}

async function AdminPageLayout({children}: AdminPageLayoutProps) {
    if (!await isUserLoggedIn()) redirect(L.page("login"), RedirectType.replace);

    return <>{children}</>;
}

export default AdminPageLayout;
