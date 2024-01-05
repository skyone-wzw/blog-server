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

    dir: {
        data: string;
        image: string;
        cover: string;
        random: string;
        profile: string;
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

type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>;
};

function isObject(item: any) {
    return (item && typeof item === "object" && !Array.isArray(item));
}

function DeepMerge<T extends object>(target: T, ...sources: DeepPartial<T>[]): T {
    if (!sources.length) return target;
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, {[key]: {}});
                // @ts-ignore
                DeepMerge(target[key], source[key]);
            } else {
                Object.assign(target, {[key]: source[key]});
            }
        }
    }

    return DeepMerge(target, ...sources);
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

        dir: {
            data: dataDir,
            image: DataDirResolve("images"),
            cover: DataDirResolve("cover"),
            random: DataDirResolve("cover/random"),
            profile: DataDirResolve("profile"),
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
    const {data, image, cover, random, profile} = config.dir;
    if (!fs.existsSync(data)) fs.mkdirSync(data);
    if (!fs.existsSync(image)) fs.mkdirSync(image);
    if (!fs.existsSync(cover)) fs.mkdirSync(cover);
    if (!fs.existsSync(random)) fs.mkdirSync(random);
    if (!fs.existsSync(profile)) fs.mkdirSync(profile);
}();

export default config;
