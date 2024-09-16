import {Root} from "mdast";
import {cache} from "react";
import remarkParse from "remark-parse";
import {unified} from "unified";
import {visit} from "unist-util-visit";

const ParseArticleImages = cache(async (content: string) => {
    const result: Root = unified()
        .use(remarkParse)
        .parse(content);
    const images = [] as string[];
    visit(result, "image", (node) => {
        if (node.url) {
            if (node.url.match(/^([a-fA-F0-9]{64}\.(webp|png|jpe?g))$/i)) {
                images.push(node.url);
            }
            if (node.url.startsWith("/assets/image/post/")) {
                images.push(node.url.slice("/assets/image/post/".length));
            }
        }
    });
    return images;
});

export default ParseArticleImages;
