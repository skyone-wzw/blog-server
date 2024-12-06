"use client";

import * as ClientComponents from "@/components/markdown/ClientComponents";
import * as Components from "@/components/markdown/Components";
import {jsxConfig} from "@/components/markdown/tools";
import {Root} from "hast";
import rehypeReact from "rehype-react";
import {unified} from "unified";

export const HASTCompiler = unified()
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

interface HASTCompilerProps {
    ast: Root;
}

export function HASTRender({ast}: HASTCompilerProps) {
    return HASTCompiler.stringify(ast);
}

export const TitleHASTCompiler = unified()
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

interface TitleHASTCompilerProps {
    ast: Root;
}

export function TitleHASTRender({ast}: TitleHASTCompilerProps) {
    if (ast.children.length === 0) return null;
    return TitleHASTCompiler.stringify(ast);
}
