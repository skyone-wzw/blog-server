import {AES} from "@/lib/encrypt";
import {cookies} from "next/headers";
import {cache} from "react";

function verifyToken(token: string) {
    return AES.decrypt(token).startsWith("token:");
}

export function generateToken() {
    return AES.encrypt(`token:${Date.now()}`);
}

export const isUserLoggedIn = cache(async () => {
    const cookie = cookies();
    const token = cookie.get("token")?.value;
    if (!token) {
        return false;
    } else {
        return verifyToken(token);
    }
});
