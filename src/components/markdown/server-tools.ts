import {getImageMetadata} from "@/lib/images";
import {Element, Root as HTMLRoot} from "hast";
import {visit} from "unist-util-visit";

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
