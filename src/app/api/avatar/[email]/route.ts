import {getDynamicConfig} from "@/lib/config";
import {AES, HASH} from "@/lib/encrypt";
import {notFound} from "next/navigation";

interface AvatarEmailProps {
    params: {
        email: string;
    };
}

export async function GET(_: Request, {params}: AvatarEmailProps) {
    const {email: _email} = await params;
    if (!_email) return notFound();
    let email;
    try {
        email = AES.decrypt(_email);
    } catch (e) {
        return notFound();
    }
    const hash = HASH.sha256(email);
    const dynamicConfig = await getDynamicConfig();
    const url = `${dynamicConfig.options.gravatar}/${hash}?s=64`;
    const result = await fetch(url);

    return new Response(result.body, {
        headers: {
            "Content-Type": "image/png",
        },
    });
}
