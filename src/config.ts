import {DeepMerge, DeepPartial} from "@/lib/type-utils";
import fs from "fs";
import path from "path";
import packageJson from "../package.json";

interface Config {
    title: string;
    description: string;
    cover: string;
    url: string;

    master: {
        name: string;
        avatar: string;
        cover: string;
        description: string;
        email?: string;
        github?: string;
        zhihu?: string;
    };

    avatar: {
        gravatar: string;
    };

    theme: {
        colorTransition: boolean;
    };

    dir: {
        data: string;
        image: string;
        cover: string;
        random: string;
        profile: string;
        custom: string;
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

const dataDir = process.env.DATA_DIR || path.resolve(process.cwd(), "data");

export function DataDirResolve(...paths: string[]) {
    return path.resolve(dataDir, ...paths);
}

const config = (() => {
    const configFile = DataDirResolve("config.json");
    let userConfig: DeepPartial<Config>;
    try {
        userConfig = JSON.parse(fs.readFileSync(configFile, "utf-8"));
    } catch (e) {
        userConfig = {};
    }

    const defaultConfig: Config = {
        title: "Example Blog",
        description: "Example Blog - 关注有趣的技术",
        cover: `/api/image/profile?type=og-cover`,
        url: "https://blog.example.com",

        master: {
            name: "Example",
            avatar: "/api/image/profile?type=avatar",
            cover: "/api/image/profile?type=profile-cover",
            description: "科技爱好者",
            email: "i@example.com",
            github: "example",
        },

        avatar: {
            gravatar: "https://www.gravatar.com/avatar",
        },

        theme: {
            colorTransition: false,
        },

        dir: {
            data: dataDir,
            image: DataDirResolve("image/post"),
            cover: DataDirResolve("image/cover"),
            random: DataDirResolve("image/cover/random"),
            profile: DataDirResolve("profile"),
            custom: DataDirResolve("image/custom"),
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
                {
                    name: "友链",
                    url: "/friends",
                },
            ],
        },

        package: packageJson,
    };

    return DeepMerge(defaultConfig, userConfig);
})();

if (config.auth.email === undefined || config.auth.password === undefined) {
    console.error("Auth email or password is not set!");
    process.exit(1);
}

if (config.secret.key === undefined || config.secret.iv === undefined) {
    console.error("Secret key or iv is not set!");
    process.exit(1);
}

void function () {
    const {data, image, cover, random, profile, custom} = config.dir;
    if (!fs.existsSync(data)) fs.mkdirSync(data, {recursive: true});
    if (!fs.existsSync(image)) fs.mkdirSync(image, {recursive: true});
    if (!fs.existsSync(cover)) fs.mkdirSync(cover, {recursive: true});
    if (!fs.existsSync(random)) fs.mkdirSync(random, {recursive: true});
    if (!fs.existsSync(profile)) fs.mkdirSync(profile, {recursive: true});
    if (!fs.existsSync(custom)) fs.mkdirSync(custom, {recursive: true});
}();

export default config;
