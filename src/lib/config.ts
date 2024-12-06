import prisma from "@/lib/prisma";
import {DeepMergeTemplate, DeepPartial} from "@/lib/type-utils";
import {cache} from "react";

namespace Database {
    interface ConfigEntity {
        id: string;
        key: string;
        value: string;
        createdAt: Date;
        updatedAt: Date;
    }

    export type Config = ConfigEntity[]
}

export interface SiteDynamicConfig {
    title: string;
    logo: string;
    description: string;
    cover: string;
    url: string;
    keywords: string[];
}

export interface ProfileDynamicConfig {
    name: string;
    avatar: string;
    cover: string;
    description: string;
    email: string;
    social: {
        github?: string;
        zhihu?: string;
    };
}

export interface NavbarDynamicConfig {
    items: {
        name: string;
        url: string;
    }[];
}

export interface FediverseDynamicConfig {
    enabled: boolean;
    name?: string;
    preferredUsername: string;
    summary?: string;
    publicKey: string;
    privateKey: string;
}

export interface DynamicConfig {
    site: SiteDynamicConfig;

    profile: ProfileDynamicConfig;

    options: {
        gravatar: string;
    };

    navbar: NavbarDynamicConfig;

    fediverse: FediverseDynamicConfig;
}

export const defaultDynamicConfig: DynamicConfig = {
    site: {
        title: "My Blog",
        logo: "/default/logo.png",
        description: "A blog powered by Blog Server",
        cover: "/default/og-cover.webp",
        url: "https://example.com",
        keywords: ["Blog"],
    },
    profile: {
        name: "Explorers",
        avatar: "/default/avatar.webp",
        cover: "/default/cover.webp",
        description: "科技爱好者",
        email: "i@example.com",
        social: {
            github: "example",
            zhihu: "example",
        },
    },

    options: {
        gravatar: "https://www.gravatar.com/avatar",
    },

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

    fediverse: {
        enabled: false,
        preferredUsername: "master",
        publicKey: "",
        privateKey: "",
    },
};

export const getDynamicConfig = cache(async (): Promise<DynamicConfig> => {
    const db = await prisma.config.findMany();
    const config: DeepPartial<DynamicConfig> = {};
    for (const item of db) {
        // @ts-ignore
        config[item.key] = JSON.parse(item.value);
    }
    return DeepMergeTemplate(defaultDynamicConfig, config);
});
