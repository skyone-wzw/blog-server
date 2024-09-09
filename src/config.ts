import {DeepMerge, DeepPartial} from "@/lib/type-utils";
import fs from "fs";
import path from "path";
import DefaultCoverImage from "./default-cover";
import packageJson from "../package.json";

interface Config {
    theme: {
        colorTransition: boolean;
    };

    dir: {
        data: string;
        image: string;
        cover: string;
        random: string;
        custom: string;
        cache: string;
    };

    auth: {
        email: string;
        password: string;
    };

    secret: {
        key: string;
        iv: string;
    },

    package: typeof packageJson;
}

const dataDir = process.env.DATA_DIR || path.resolve(process.cwd(), "data");

export function DataDirResolve(...paths: string[]) {
    return path.resolve(dataDir, ...paths);
}

const config = (() => {
    const configFile = DataDirResolve("config.json");
    let fileConfig: DeepPartial<Config>;
    try {
        fileConfig = JSON.parse(fs.readFileSync(configFile, "utf-8"));
    } catch (e) {
        fileConfig = {};
    }

    const defaultConfig = {
        theme: {
            colorTransition: false,
        },

        dir: {
            data: dataDir,
            image: DataDirResolve("image/post"),
            cover: DataDirResolve("image/cover"),
            random: DataDirResolve("image/cover/random"),
            custom: DataDirResolve("image/custom"),
            cache: DataDirResolve("cache"),
        },

        package: packageJson,
    } as Config;

    const envConfig = {auth: {}, secret: {}} as DeepPartial<Config>;
    if (process.env.AUTH_EMAIL) envConfig.auth!.email = process.env.AUTH_EMAIL;
    if (process.env.AUTH_PASSWORD) envConfig.auth!.password = process.env.AUTH_PASSWORD;
    if (process.env.SECRET_KEY) envConfig.secret!.key = process.env.SECRET_KEY;
    if (process.env.SECRET_IV) envConfig.secret!.iv = process.env.SECRET_IV;

    return DeepMerge(defaultConfig, fileConfig, envConfig);
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
    const {data, image, cover, random, custom, cache} = config.dir;
    if (!fs.existsSync(data)) fs.mkdirSync(data, {recursive: true});
    if (!fs.existsSync(image)) fs.mkdirSync(image, {recursive: true});
    if (!fs.existsSync(cover)) fs.mkdirSync(cover, {recursive: true});
    if (!fs.existsSync(random)) fs.mkdirSync(random, {recursive: true});
    if (!fs.existsSync(custom)) fs.mkdirSync(custom, {recursive: true});
    if (!fs.existsSync(cache)) fs.mkdirSync(cache, {recursive: true});
    if (fs.readdirSync(random).filter(file => file.match(/\.(jpe?g|png|webp)$/i)).length === 0) {
        fs.writeFileSync(`${random}/default.webp`, DefaultCoverImage);
    }
}();

export default config;
