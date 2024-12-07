"use client";

import * as CommentComponents from "@/components/markdown/CommentComponents";
import {jsxConfig} from "@/components/markdown/tools";
import {Root} from "hast";
import rehypeReact from "rehype-react";
import {unified} from "unified";

export const HASTCompiler = unified()
    .use(rehypeReact, {
        ...jsxConfig, components: {
            a: CommentComponents.A,
            blockquote: CommentComponents.Blockquote,
            code: CommentComponents.Code,
            em: CommentComponents.Em,
            h1: CommentComponents.H1,
            h2: CommentComponents.H2,
            h3: CommentComponents.H3,
            h4: CommentComponents.H4,
            h5: CommentComponents.H5,
            h6: CommentComponents.H6,
            hr: CommentComponents.Hr,
            iframe: CommentComponents.Noop,
            img: CommentComponents.Img,
            ol: CommentComponents.Ol,
            p: CommentComponents.P,
            pre: CommentComponents.Pre,
            script: CommentComponents.Noop,
            span: CommentComponents.Span,
            strong: CommentComponents.Strong,
            table: CommentComponents.Table,
            thead: CommentComponents.THead,
            th: CommentComponents.Th,
            td: CommentComponents.Td,
            tr: CommentComponents.Tr,
            ul: CommentComponents.Ul,
            li: CommentComponents.Li,
        },
    });

interface CommentHASTCompilerProps {
    ast: Root;
}

export function CommentHASTRender({ast}: CommentHASTCompilerProps) {
    return HASTCompiler.stringify(ast);
}
