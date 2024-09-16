import {HASTCompiler} from "@/components/markdown/HASTRender";
import {BlockQuotePlugin} from "@/components/markdown/plugins";
import {autofixHeadingLevel, autoHeadingId, makeImageUrl, markLineNumber} from "@/components/markdown/tools";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import {unified} from "unified";

export const ClientMarkdownProcessor = unified()
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
    .use(makeImageUrl)
    .use(markLineNumber);

async function ClientMarkdownRender(content: string) {
    const mdast = ClientMarkdownProcessor.parse(content);
    const hast = await ClientMarkdownProcessor.run(mdast);
    return HASTCompiler.stringify(hast);
}

export default ClientMarkdownRender;
