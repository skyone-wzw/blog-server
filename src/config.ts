import Avatar from "@/profile/avatar.webp";
import OGCover from "@/profile/og-cover.webp";
import ProfileCover from "@/profile/prfile-cover.webp";
import {StaticImport} from "next/dist/shared/lib/get-img-props";
import packageJson from "../package.json";

interface Config {
    title: string;
    description: string;
    cover: string;
    url: string;

    imageDir: string;

    master: {
        name: string;
        avatar: StaticImport;
        cover: StaticImport;
        description: string;
        email?: string;
        github?: string;
        zhihu?: string;
    };

    auth: {
        email: string;
        password: string;
    };

    secret: {
        key: string;
        iv: string;
    },

    keywords: string[];

    navbar: {
        items: {
            name: string;
            url: string;
        }[];
    };

    package: typeof packageJson;
}

const config: Config = {
    title: "Example Blog",
    description: "Example Blog - 关注有趣的技术",
    cover: `https://blog.example.com${OGCover.src}`,
    url: "https://blog.example.com",

    imageDir: "images",

    master: {
        name: "Example",
        avatar: Avatar,
        cover: ProfileCover,
        description: "科技爱好者",
        email: "i@example.com",
        github: "example",
    },

    auth: {
        email: process.env.AUTH_EMAIL!,
        password: process.env.AUTH_PASSWORD!,
    },

    secret: {
        key: process.env.SECRET_KEY!,
        iv: process.env.SECRET_IV!,
    },

    keywords: ["blog"],

    navbar: {
        items: [
            {
                name: "分类",
                url: "/series",
            },
            {
                name: "标签",
                url: "/tags",
            },
            {
                name: "归档",
                url: "/archive",
            },
        ],
    },

    package: packageJson,
};

if (config.auth.email === undefined || config.auth.password === undefined) {
    console.error("Auth email or password is not set!");
    process.exit(1);
}

if (config.secret.key === undefined || config.secret.iv === undefined) {
    console.error("Secret key or iv is not set!");
    process.exit(1);
}

export default config;
