import Paper from "@/components/base/Paper";
import L from "@/lib/links";
import Link from "next/link";
import {getTranslations} from "next-intl/server";

interface RouterItem {
    name: string;
    url: string;
}

async function AdminLeftPage() {
    const t = await getTranslations("page.admin.aside");
    const routers: RouterItem[] = [
        {
            name: t("GeneralSettings.AdminConsole"),
            url: L.admin(),
        },
        {
            name: t("GeneralSettings.ArticleEditor"),
            url: L.editor.post(),
        },
        {
            name: t("GeneralSettings.CustomPageEditor"),
            url: L.editor.custom(),
        },
        {
            name: t("GeneralSettings.FriendLink"),
            url: L.admin("friends"),
        },
        {
            name: t("GeneralSettings.CommentManager"),
            url: L.admin("comments"),
        }
    ];

    const configs: RouterItem[] = [
        {
            name: t("SiteSettings.ProfileSettings"),
            url: L.admin("settings/profile"),
        },
        {
            name: t("SiteSettings.SiteSettings"),
            url: L.admin("settings/site"),
        },
        {
            name: t("SiteSettings.NavbarSettings"),
            url: L.admin("settings/navbar"),
        },
        {
            name: t("SiteSettings.FediverseSettings"),
            url: L.admin("settings/fediverse"),
        },
    ];

    const assets: RouterItem[] = [
        {
            name: t("AssetsManagement.AssetsManagement"),
            url: L.admin("assets/images"),
        },
    ];

    return (
        <div className="mb-6 col-start-1 space-y-6">
            <Paper className="p-4 divide-y divide-bg-tag">
                <h2 className="mb-2 text-text-subnote">{t("GeneralSettings.title")}</h2>
                {routers.map((router, index) => (
                    <Link className="block p-2 text-text-content justify-between hover:bg-bg-hover"
                          href={router.url} key={index}>
                        {router.name}
                    </Link>
                ))}
            </Paper>
            <Paper className="p-4 divide-y divide-bg-tag">
                <h2 className="mb-2 text-text-subnote">{t("SiteSettings.title")}</h2>
                {configs.map((router, index) => (
                    <Link className="block p-2 text-text-content justify-between hover:bg-bg-hover"
                          href={router.url} key={index}>
                        {router.name}
                    </Link>
                ))}
            </Paper>
            <Paper className="p-4 divide-y divide-bg-tag">
                <h2 className="mb-2 text-text-subnote">{t("AssetsManagement.title")}</h2>
                {assets.map((router, index) => (
                    <Link className="block p-2 text-text-content justify-between hover:bg-bg-hover"
                          href={router.url} key={index}>
                        {router.name}
                    </Link>
                ))}
            </Paper>
        </div>
    );
}

export default AdminLeftPage;
