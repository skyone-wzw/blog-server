import {isUserLoggedIn} from "@/lib/auth";
import {getDynamicConfig} from "@/lib/config";
import L from "@/lib/links";
import Image from "next/image";
import {redirect, RedirectType} from "next/navigation";
import LoginForm from "./LoginForm";
import {getTranslations} from "next-intl/server";

export async function generateMetadata() {
    const {site} = await getDynamicConfig();
    const t = await getTranslations("page.login.metadata");

    return {
        title: t("title", {siteName: site.title}),
        description: t("description", {siteName: site.title}),
    };
}

async function LoginPage() {
    if (await isUserLoggedIn()) redirect("/admin", RedirectType.replace);
    const dynamicConfig = await getDynamicConfig();
    const t = await getTranslations("page.login");

    return (
        <div className="flex flex-col justify-center items-center p-12 row-start-2">
            <Image src={L.image.custom(dynamicConfig.profile.avatar)} width="64" height="64"
                   alt={dynamicConfig.profile.name}
                   className="h-16 w-16 rounded-full mb-4 block"/>
            <h1 className="text-xl pb-6 text-text-main">{t("title")}</h1>
            <LoginForm/>
        </div>
    );
}

export default LoginPage;
