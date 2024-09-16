import {appendImageMetadata} from "@/components/markdown/server-tools";
import {autoHeadingId, headingFilter, jsxConfig, removePosition} from "@/components/markdown/tools";
import config from "@/config";
import fs from "fs/promises";
import {cache} from "react";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import rehypeReact from "rehype-react";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import {unified} from "unified";
import {VFile} from "vfile";
import * as ClientComponents from "./ClientComponents";
import * as Components from "./Components";

const ArticleTitleProcessor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(headingFilter)
    .use(autoHeadingId)
    .use(remarkRehype)
    .use(rehypeKatex)
    .use(rehypeRaw)
    .use(appendImageMetadata)
    .use(removePosition);

const ArticleTitleCompiler = unified()
    // @ts-expect-error
    .use(rehypeReact, {
        ...jsxConfig, components: {
            a: Components.AInNavBar,
            code: Components.Code,
            em: Components.Em,
            img: Components.Img,
            strong: Components.Strong,
            h2: ClientComponents.HeadingLink2,
            h3: ClientComponents.HeadingLink3,
        },
    });

interface ArticleLikeType {
    content: string;
    updatedAt: Date;
    slug: string;
}

const cacheDir = config.dir.cache;

export async function PreprocessArticleTitle(article: ArticleLikeType) {
    const cacheFile = `${cacheDir}/${article.slug}-${article.updatedAt.getTime()}-title.json`;
    if (await fs.access(cacheFile).then(() => true).catch(() => false)) {
        try {
            return JSON.parse(await fs.readFile(cacheFile, "utf-8"));
        } catch (e) {
        }
    }
    const mdast = ArticleTitleProcessor.parse(article.content);
    const ast = await ArticleTitleProcessor.run(mdast, new VFile({value: article.content}));
    await fs.writeFile(cacheFile, JSON.stringify(ast));
    return ast;
}

const ParseArticleTitle = cache(async (article: ArticleLikeType) => {
    const ast = await PreprocessArticleTitle(article);
    return ArticleTitleCompiler.stringify(ast);
});

export default ParseArticleTitle;
