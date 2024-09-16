import {BlockQuotePlugin} from "@/components/markdown/plugins";
import {appendImageMetadata} from "@/components/markdown/server-tools";
import {autofixHeadingLevel, autoHeadingId, jsxConfig, removePosition} from "@/components/markdown/tools";
import config from "@/config";
import fs from "fs/promises";
import {cache} from "react";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import rehypeReact from "rehype-react";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import {unified} from "unified";
import {VFile} from "vfile";
import * as Components from "./Components";

const cacheDir = config.dir.cache;

const ServerMarkdownProcessor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(autofixHeadingLevel)
    .use(autoHeadingId)
    .use(BlockQuotePlugin)
    .use(remarkRehype, {allowDangerousHtml: true})
    .use(rehypeKatex)
    .use(rehypeHighlight)
    .use(rehypeRaw)
    .use(appendImageMetadata)
    .use(removePosition);

const ServerMarkdownCompiler = unified()
    // @ts-expect-error
    .use(rehypeReact, {
        ...jsxConfig, components: {
            a: Components.A,
            blockquote: Components.Blockquote,
            code: Components.Code,
            em: Components.Em,
            h1: Components.H1,
            h2: Components.H2,
            h3: Components.H3,
            h4: Components.H4,
            h5: Components.H5,
            h6: Components.H6,
            hr: Components.Hr,
            iframe: Components.IFrame,
            img: Components.Img,
            ol: Components.Ol,
            p: Components.P,
            pre: Components.Pre,
            strong: Components.Strong,
            table: Components.Table,
            thead: Components.THead,
            th: Components.Th,
            td: Components.Td,
            tr: Components.Tr,
            ul: Components.Ul,
            li: Components.Li,
        },
    });

interface ArticleLikeType {
    content: string;
    updatedAt: Date;
    slug: string;
}

export async function PreprocessArticleContent(article: ArticleLikeType) {
    const cacheFile = `${cacheDir}/${article.slug}-${article.updatedAt.getTime()}.json`;
    if (await fs.access(cacheFile).then(() => true).catch(() => false)) {
        try {
            return JSON.parse(await fs.readFile(cacheFile, "utf-8"));
        } catch (e) {
        }
    }
    const mdast = ServerMarkdownProcessor.parse(article.content);
    const ast = await ServerMarkdownProcessor.run(mdast, new VFile({value: article.content}));
    await fs.writeFile(cacheFile, JSON.stringify(ast));
    return ast;
}

const ServerMarkdownRender = cache(async (article: ArticleLikeType) => {
    const ast = await PreprocessArticleContent(article);
    return ServerMarkdownCompiler.stringify(ast);
});

export default ServerMarkdownRender;
