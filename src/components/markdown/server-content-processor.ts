import {BlockQuotePlugin} from "@/components/markdown/plugins";
import {appendImageMetadata} from "@/components/markdown/server-tools";
import {autofixHeadingLevel, autoHeadingId, removePosition} from "@/components/markdown/tools";
import config from "@/config";
import fs from "fs/promises";
import {Root} from "hast";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import {unified} from "unified";
import {VFile} from "vfile";

const cacheDir = config.dir.cache;

export const ServerMarkdownProcessor = unified()
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

interface ArticleLikeType {
    content: string;
    updatedAt: Date;
    slug: string;
}

export async function PreprocessArticleContent(article: ArticleLikeType) {
    const cacheFile = `${cacheDir}/${article.slug}-${article.updatedAt.getTime()}.json`;
    if (await fs.access(cacheFile).then(() => true).catch(() => false)) {
        try {
            return JSON.parse(await fs.readFile(cacheFile, "utf-8")) as Root;
        } catch (e) {
        }
    }
    const mdast = ServerMarkdownProcessor.parse(article.content);
    const ast = await ServerMarkdownProcessor.run(mdast, new VFile({value: article.content}));
    await fs.writeFile(cacheFile, JSON.stringify(ast));
    return ast;
}

// 每次服务端渲染只会调用一次, 所以不需要缓存, 暂时 mark
// export const PreprocessArticleContent = cache(_PreprocessArticleContent);
