import {autoHeadingId, headingFilter, jsxConfig} from "@/components/markdown/tools";
import {cache} from "react";
import rehypeKatex from "rehype-katex";
import rehypeReact from "rehype-react";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import {unified} from "unified";
import * as ClientComponents from "./ClientComponents";
import * as Components from "./Components";

const ParseArticleTitle = cache(async (content: string) => {
    const elements = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkMath)
        .use(headingFilter)
        .use(autoHeadingId)
        .use(remarkRehype)
        .use(rehypeKatex)
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
        })
        .process(content);
    return elements.result;
});

export default ParseArticleTitle;
