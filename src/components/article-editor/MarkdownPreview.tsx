import {ReactNode, useEffect, useRef, useState} from "react";
import "katex/dist/katex.css";
import "@/components/markdown/article.css";

type MarkdownRenderType = (content: string) => Promise<ReactNode>;

interface MarkdownPreviewProps {
    content: string;
}

function MarkdownPreview({content}: MarkdownPreviewProps) {
    const waiter = useRef(0);
    const [render, setRender] = useState<MarkdownRenderType>();
    const [elements, setElements] = useState<ReactNode>();

    useEffect(() => {
        const start = Date.now();
        import("@/components/markdown/ClientMarkdownRender")
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
            setTimeout(() => {
                if (now === waiter.current) {
                    render(content).then(setElements).catch(() => {
                    });
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
