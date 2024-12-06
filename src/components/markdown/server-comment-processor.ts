import {BlockQuotePlugin} from "@/components/markdown/plugins";
import {autoHeadingId, fixFediverseUidLink, removePosition} from "@/components/markdown/tools";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import {unified} from "unified";
import {VFile} from "vfile";
import rehypeSanitize from "rehype-sanitize";
import rehypeParse from "rehype-parse";

export const ServerCommentMarkdownProcessor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(autoHeadingId)
    .use(BlockQuotePlugin)
    .use(fixFediverseUidLink)
    .use(remarkRehype)
    .use(rehypeKatex)
    .use(rehypeHighlight)
    .use(rehypeRaw)
    .use(removePosition);

export async function PreprocessCommentSource(source: string) {
    const mdast = ServerCommentMarkdownProcessor.parse(source);
    return await ServerCommentMarkdownProcessor.run(mdast, new VFile({value: source}));
}

export const ServerCommentHtmlProcessor = unified()
    .use(rehypeParse)
    .use(rehypeSanitize)
    .use(removePosition);

export async function PreprocessCommentHtml(html: string) {
    const hast = ServerCommentHtmlProcessor.parse(html);
    return await ServerCommentHtmlProcessor.run(hast, new VFile({value: html}));
}
