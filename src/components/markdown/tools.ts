import {getImageMetadata} from "@/lib/images";
import {Heading, Root as MDRoot} from "mdast";
import {Element, Root as HTMLRoot} from "hast";
import * as prod from "react/jsx-runtime";
import {visit} from "unist-util-visit";
import {VFile} from "vfile";

export const jsxConfig = {Fragment: prod.Fragment, jsx: prod.jsx, jsxs: prod.jsxs};

export function headingFilter() {
    return (tree: MDRoot, _: VFile) => {
        tree.children = tree.children.filter(node => node.type === "heading" && node.depth >= 2 && node.depth <= 3);
    };
}

export function autofixHeadingLevel() {
    return function (tree: MDRoot, _: VFile) {
        const h1 = tree.children.filter(node => node.type === "heading" && node.depth === 1);
        if (h1.length >= 1) {
            // 将所有 heading 降 1 级
            visit(tree, "heading", (node: Heading) => {
                if (node.depth < 6) {
                    node.depth++;
                } else {
                    Object.assign(node, {
                        type: "paragraph",
                        depth: undefined,
                    });
                }
            });
        }
    };
}

export function autoHeadingId() {
    const used = {} as Record<string, number>;

    const uniqueId = (prefix: string) => {
        if (used[prefix]) {
            used[prefix]++;
            return `${prefix}-${used[prefix]}`;
        } else {
            used[prefix] = 1;
            return prefix;
        }
    };

    return (tree: MDRoot, file: VFile) => {
        visit(tree, "heading", (node: Heading) => {
            node.data = node.data || {};
            node.data.hProperties = node.data.hProperties || {};
            const lastChild = node.children[node.children.length - 1];
            // 使用 {#id} 语法
            if (lastChild && lastChild.type === "text") {
                let string = lastChild.value.replace(/ +$/, "");
                const matched = string.match(/ {#([^]+?)}$/);

                if (matched) {
                    let id = matched[1];
                    if (!!id.length) {
                        node.data.hProperties.id = uniqueId(id);

                        string = string.substring(0, matched.index);
                        lastChild.value = string;
                        return;
                    }
                }
            }
            // 使用标题内容作为 id
            if (!node.data.hProperties.id && node.position?.start.offset && node.position.end.offset) {
                const formatId = (id: string) => id
                    .replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, "-")
                    .replace(/-+/g, "-")
                    .replace(/^-|-$/g, "");
                let id = formatId(String(file.value).slice(node.position.start.offset, node.position.end.offset));
                node.data.hProperties.id = uniqueId(id);
            }
            // 回退到默认 id
            if (!node.data.hProperties.id) {
                node.data.hProperties.id = uniqueId("title");
            }
        });
    };
}

export function markLineNumber() {
    return (tree: HTMLRoot) => {
        visit(tree, "element", (node: Element) => {
            const line = node.position?.start.line;
            if (line) {
                node.properties = node.properties || {};
                node.properties["data-line"] = line;
            }
        });
    };
}

export function removePosition() {
    return (tree: HTMLRoot) => {
        visit(tree, (node: any) => {
            delete node.position;
        });
    };
}

export function appendImageMetadata() {
    return async (tree: HTMLRoot) => {
        const promises: Promise<void>[] = [];
        visit(tree, "element", (node: Element) => {
            if (node.tagName === "img") {
                promises.push((async () => {
                    const src = node.properties?.src as string;
                    if (src && (src.startsWith("/") || src.match(/^[a-fA-F0-9]{64}\.(webp|png|jpe?g)$/))) {
                        const metadata = await getImageMetadata(src);
                        if (metadata) {
                            node.properties = node.properties || {};
                            node.properties.width = metadata.width;
                            node.properties.height = metadata.height;
                        }
                    }
                })().catch(() => {
                }));
            }
        });
        await Promise.all(promises);
    };
}
