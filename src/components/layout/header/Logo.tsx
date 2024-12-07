import {getDynamicConfig} from "@/lib/config";
import L from "@/lib/links";
import clsx from "clsx";
import Image from "next/image";
import {getTranslations} from "next-intl/server";

interface LogoProps {
    className?: string;
}

async function Logo({className}: LogoProps) {
    const dynamicConfig = await getDynamicConfig();
    const t = await getTranslations("header.HeaderLogo");
    return (
        <Image alt={t("alt")} src={L.image.custom(dynamicConfig.site.logo)} height={64} width={64}
               className={clsx("mx-auto w-6 h-6 object-cover", className)}/>
    );
}

export default Logo;
