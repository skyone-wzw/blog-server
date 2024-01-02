import {Heading, Root} from "mdast";
import * as prod from "react/jsx-runtime";
import {visit} from "unist-util-visit";
import {VFile} from "vfile";

// @ts-expect-error: the react types are missing.
export const jsxConfig = {Fragment: prod.Fragment, jsx: prod.jsx, jsxs: prod.jsxs};

export function headingFilter() {
    return (tree: Root, _: VFile) => {
        tree.children = tree.children.filter(node => node.type === "heading" && node.depth >= 2 && node.depth <= 3);
    };
}

export function autoHeadingId() {
    return (tree: Root, file: VFile) => {
        visit(tree, "heading", (node: Heading) => {
            const lastChild = node.children[node.children.length - 1];
            if (lastChild && lastChild.type === "text") {
                let string = lastChild.value.replace(/ +$/, "");
                const matched = string.match(/ {#([^]+?)}$/);

                if (matched) {
                    let id = matched[1];
                    if (!!id.length) {
                        node.data = node.data || {};
                        node.data.hProperties = node.data.hProperties || {};
                        node.data.hProperties.id = id;

                        string = string.substring(0, matched.index);
                        lastChild.value = string;
                        return;
                    }
                }
            }
            if (!node?.data?.hProperties?.id && node.position?.start.offset && node.position?.end.offset) {
                const formatId = (id: string) => id
                    .replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, "-")
                    .replace(/-+/g, "-")
                    .replace(/^-|-$/g, "");
                node.data = node.data || {};
                node.data.hProperties = node.data.hProperties || {};
                node.data.hProperties.id = formatId(String(file.value).slice(node.position.start.offset, node.position.end.offset));
            }
        });
    }
}

export function getHeadingId(children: any): string {
    if (!children) return "";
    if (Array.isArray(children)) {
        const res = [];
        for (const child of children) {
            if (typeof child === "string") {
                res.push(child);
            } else if (child?.props?.children) {
                res.push(getHeadingId(child?.props?.children));
            }
        }
        return res.join("");
    } else if (typeof children === "string") {
        return children
    } else if (children?.props?.children) {
        return getHeadingId(children?.props?.children);
    } else {
        return "";
    }
}