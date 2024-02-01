import {getDynamicConfig} from "@/lib/config";
import L from "@/lib/links";
import clsx from "clsx";
import Image from "next/image";

interface LogoProps {
    className?: string;
}

async function Logo({className}: LogoProps) {
    const dynamicConfig = await getDynamicConfig();
    return (
        <Image alt="profil" src={L.image.custom(dynamicConfig.site.logo)} height={64} width={64}
               className={clsx("mx-auto w-6 h-6 object-cover", className)}/>
    );
}

export default Logo;
