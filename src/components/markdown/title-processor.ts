import {appendImageMetadata} from "@/components/markdown/server-tools";
import {autoHeadingId, headingFilter, removePosition} from "@/components/markdown/tools";
import config from "@/config";
import fs from "fs/promises";
import {Root} from "hast";
import {cache} from "react";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import {unified} from "unified";
import {VFile} from "vfile";

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

interface ArticleLikeType {
    content: string;
    updatedAt: Date;
    slug: string;
}

const cacheDir = config.dir.cache;

async function _PreprocessArticleTitle(article: ArticleLikeType) {
    // custom page 的 slug 可以包含 /, 会导致文件名不合法
    // 替换 / 为 @ 以避免问题
    const slug = article.slug.replace(/\//g, "@");
    const cacheFile = `${cacheDir}/${slug}-${article.updatedAt.getTime()}-title.json`;
    if (await fs.access(cacheFile).then(() => true).catch(() => false)) {
        try {
            return JSON.parse(await fs.readFile(cacheFile, "utf-8")) as Root;
        } catch (e) {
        }
    }
    const mdast = ArticleTitleProcessor.parse(article.content);
    const ast = await ArticleTitleProcessor.run(mdast, new VFile({value: article.content}));
    await fs.writeFile(cacheFile, JSON.stringify(ast));
    return ast;
}

export const PreprocessArticleTitle = cache(_PreprocessArticleTitle);
