"use client";

import {ReactNode, useEffect, useRef, useState} from "react";
import "katex/dist/katex.css";
import "@/components/markdown/article.css";
import {useTranslations} from "next-intl";

type MarkdownRenderType = (content: string) => Promise<ReactNode>;

interface MarkdownPreviewProps {
    content: string;
}

function MarkdownPreview({content}: MarkdownPreviewProps) {
    const waiter = useRef(0);
    const [render, setRender] = useState<MarkdownRenderType>();
    const [elements, setElements] = useState<ReactNode>();
    const t = useTranslations("article-editor.MarkdownPreview");

    useEffect(() => {
        const start = Date.now();
        import("@/components/markdown/client-content-processor")
            .then(({default: MarkdownRender}) => {
                const end = Date.now();
                if (end - start < 500) {
                    setTimeout(() => {
                        setRender(() => MarkdownRender);
                    }, 500 - (end - start));
                } else {
                    setRender(() => MarkdownRender);
                }
            });
    }, []);

    useEffect(() => {
        if (render) {
            const now = Date.now();
            waiter.current = now;
            setTimeout(async () => {
                if (now === waiter.current) {
                    try {
                        const element = await render(content);
                        setElements(element);
                    } catch (err) {
                        setElements(
                            <>
                                <p className="mb-4 text-2xl text-text-main">{t("renderError")}</p>
                                {err?.toString &&
                                    <p className="mb-2 font-mono text-md text-text-subnote">{err?.toString()}</p>}
                                <p className="mb-6 text-md text-text-subnote">{t("renderErrorDescription")}</p>
                            </>,
                        );
                    }
                }
            }, 500);
        }
    }, [render, content]);

    if (!render) {
        return (
            <div className="h-full w-full text-button-bg flex flex-col justify-center items-center">
                <div
                    className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                    role="status"/>
            </div>
        );
    }

    return elements;
}

export default MarkdownPreview;
