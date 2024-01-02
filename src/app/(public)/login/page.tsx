import config from "@/config";
import {isUserLoggedIn} from "@/lib/auth";
import Image from "next/image";
import {redirect, RedirectType} from "next/navigation";
import LoginForm from "./LoginForm";

async function LoginPage() {
    if (await isUserLoggedIn()) redirect("/editor", RedirectType.replace);
    return (
        <div className="flex flex-col justify-center items-center p-12">
            <Image src={config.master.avatar} alt={config.master.name} className="h-16 w-16 rounded-full mb-4 block"/>
            <h1 className="text-xl pb-6 text-text-main">登录你的账户</h1>
            <LoginForm/>
        </div>
    );
}

export default LoginPage;