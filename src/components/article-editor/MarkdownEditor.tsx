"use client";

import MarkdownPreview from "@/components/article-editor/MarkdownPreview";
import {useColorMode} from "@/components/ColorModeProvider";
import clsx from "clsx";
import type {editor as MonacoEditor} from "monaco-editor";
import {useEffect, useRef, useState} from "react";

interface MarkdownEditorProps {
    content: string;
    setContent: (content: string) => void;
    isPreview: boolean;
    className?: string;
}

function MarkdownEditor({content: PrevContent, setContent: setPrevContent, isPreview, className}: MarkdownEditorProps) {
    const [content, setContent] = useState("");
    const {currentColorMode} = useColorMode();
    const inputRef = useRef<HTMLDivElement>(null);
    const previewRef = useRef<HTMLDivElement>(null);
    const editorRef = useRef<MonacoEditor.IStandaloneCodeEditor | null>(null);

    useEffect(() => {
        import("monaco-editor")
            .then((monaco) => {
                if (!self.MonacoEnvironment) {
                    self.MonacoEnvironment = {
                        getWorkerUrl: function (moduleId, label) {
                            const base = "_next/static/chunks";
                            if (label === "json") {
                                return `${base}/json.worker.js`;
                            }
                            if (label === "css" || label === "scss" || label === "less") {
                                return `${base}/css.worker.js`;
                            }
                            if (label === "html" || label === "handlebars" || label === "razor") {
                                return `${base}/html.worker.js`;
                            }
                            if (label === "typescript" || label === "javascript") {
                                return `${base}/ts.worker.js`;
                            }
                            return `${base}/editor.worker.js`;
                        },
                    };
                }
                if (process.env.NODE_ENV === "production" || !editorRef.current) {
                    editorRef.current = monaco.editor.create(inputRef.current!, {
                        value: PrevContent,
                        language: "markdown",
                        wordWrap: "on",
                        theme: currentColorMode === "dark" ? "vs-dark" : "vs",
                    });
                    const editor = editorRef.current;
                    editor.onDidScrollChange(() => {
                        const line = editor.getVisibleRanges()[0]?.startLineNumber;
                        if (typeof line === "number") {
                            const element = previewRef.current?.querySelector(`[data-line="${line}"]`);
                            if (element) {
                                element.scrollIntoView({behavior: "smooth", block: "start"});
                            }
                        }
                    });

                    setContent(PrevContent);
                    const model = editorRef.current.getModel();
                    model?.onDidChangeContent(() => {
                        const content = model.getValue();
                        setContent(content);
                        setPrevContent(content);
                    });
                }
            });
        // Listen window resize event
        const resize = () => {
            editorRef.current?.layout();
        };
        window.addEventListener("resize", resize);
        return () => {
            editorRef.current?.dispose();
            window.removeEventListener("resize", resize);
        };
        // 不需要 currentColorMode 作为依赖, 后续有 useEffect 处理
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [PrevContent, setPrevContent]);

    useEffect(() => {
        editorRef.current?.updateOptions({
            theme: currentColorMode === "dark" ? "vs-dark" : "vs",
        });
    }, [currentColorMode]);

    return (
        <div
            id="article-editor-markdown-editor"
            className={clsx("flex flex-row gap-x-4", className)}>
            <div
                ref={inputRef}
                className={clsx("w-0 flex-grow resize-none text-sm lg:text-base rounded-lg overflow-hidden", {
                    "hidden xl:block": isPreview,
                    "block": !isPreview,
                })}/>
            <div
                ref={previewRef}
                className={clsx(isPreview ? "block" : "hidden xl:block", "bg-bg-light rounded-lg shadow w-0 flex-grow p-4 text-sm 2xl:text-base overflow-auto pk-scroll")}>
                <MarkdownPreview content={content}/>
            </div>
        </div>
    );
}

export default MarkdownEditor;
