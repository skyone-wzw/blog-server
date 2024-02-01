import {isUserLoggedIn} from "@/lib/auth";
import {getDynamicConfig} from "@/lib/config";
import L from "@/lib/links";
import Image from "next/image";
import {redirect, RedirectType} from "next/navigation";
import LoginForm from "./LoginForm";

export async function generateMetadata() {
    const dynamicConfig = await getDynamicConfig();
    return {
        title: `登录 - ${dynamicConfig.site.title}`,
        description: `${dynamicConfig.site.description} - 编辑文章前请登录`,
    }
}

async function LoginPage() {
    if (await isUserLoggedIn()) redirect("/admin", RedirectType.replace);
    const dynamicConfig = await getDynamicConfig();
    return (
        <div className="flex flex-col justify-center items-center p-12 row-start-2">
            <Image src={L.image.custom(dynamicConfig.profile.avatar)} width="64" height="64" alt={dynamicConfig.profile.name}
                   className="h-16 w-16 rounded-full mb-4 block"/>
            <h1 className="text-xl pb-6 text-text-main">登录你的账户</h1>
            <LoginForm/>
        </div>
    );
}

export default LoginPage;
