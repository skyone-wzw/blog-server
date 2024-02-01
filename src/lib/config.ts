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

export interface DynamicConfig {
    site: {
        title: string;
        description: string;
        cover: string;
        url: string;
        keywords: string[];
    };

    profile: {
        name: string;
        avatar: string;
        cover: string;
        description: string;
        email: string;
        social: {
            github?: string;
            zhihu?: string;
        }
    };

    avatar: {
        gravatar: string;
    };

    navbar: {
        items: {
            name: string;
            url: string;
        }[];
    };
}

const defaultConfig: DynamicConfig = {
    site: {
        title: "My Blog",
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
    avatar: {
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
        ],
    },
};

export const getDynamicConfig = cache(async (): Promise<DynamicConfig> => {
    const db = await prisma.config.findMany();
    const config: DeepPartial<DynamicConfig> = {};
    for (const item of db) {
        // @ts-ignore
        config[item.key] = JSON.parse(item.value);
    }
    return DeepMergeTemplate(defaultConfig, config);
});
