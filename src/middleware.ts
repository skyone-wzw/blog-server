import {NextResponse} from "next/server";

export async function middleware(request: Request) {
    const path = new URL(request.url).pathname;
    if (request.headers.get("Accept")?.includes("application/activity+json")) {
        if (path === "/about" && request.method === "GET") {
            return NextResponse.rewrite(new URL("/api/fediverse/about", request.url));
        }
        if (path.startsWith("/post/") && request.method === "GET") {
            return NextResponse.rewrite(new URL("/api/fediverse" + path, request.url));
        }
    }
}

export const config = {
    matcher: [
        "/about",
        "/post/:slug*",
    ],
};
