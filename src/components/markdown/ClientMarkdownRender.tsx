import {BlockQuotePlugin} from "@/components/markdown/plugins";
import {autoHeadingId, jsxConfig, markLineNumber} from "@/components/markdown/tools";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import rehypeReact from "rehype-react";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import {unified} from "unified";
import * as Components from "./Components";

async function ClientMarkdownRender(content: string) {
    const elements = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkMath)
        .use(autoHeadingId)
        .use(BlockQuotePlugin)
        .use(remarkRehype, {allowDangerousHtml: true})
        .use(rehypeKatex)
        .use(rehypeHighlight)
        .use(rehypeRaw)
        .use(markLineNumber)
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
        })
        .process(content);
    return elements.result;
}

export default ClientMarkdownRender;
