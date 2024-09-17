"use client";

import MarkdownPreview from "@/components/article-editor/MarkdownPreview";
import {useColorMode} from "@/components/ColorModeProvider";
import clsx from "clsx";
import type {editor as MonacoEditor} from "monaco-editor";
import {useEffect, useRef, useState} from "react";

function useMonaco() {
    const [monaco, setMonaco] = useState<typeof import("monaco-editor")>();

    useEffect(() => {
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
        import("monaco-editor").then((monaco) => {
            setMonaco(monaco);
        });
    }, []);

    return monaco;
}

interface MarkdownEditorProps {
    initContent: string;
    content: string;
    setContent: (content: string) => void;
    isPreview: boolean;
    className?: string;
}

function MarkdownEditor({initContent, content, setContent, isPreview, className}: MarkdownEditorProps) {
    const monaco = useMonaco();
    const [editor, setEditor] = useState<MonacoEditor.IStandaloneCodeEditor>();
    const {currentColorMode} = useColorMode();
    const inputRef = useRef<HTMLDivElement>(null);
    const previewRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!monaco) return;

        if (process.env.NODE_ENV === "production" || !editor) {
            const editor = monaco.editor.create(inputRef.current!, {
                value: initContent,
                language: "markdown",
                wordWrap: "on",
                theme: currentColorMode === "dark" ? "vs-dark" : "vs",
            });
            editor.onDidScrollChange(() => {
                const line = editor.getVisibleRanges()[0]?.startLineNumber;
                if (typeof line === "number") {
                    const element = previewRef.current?.querySelector(`[data-line="${line}"]`);
                    if (element) {
                        element.scrollIntoView({behavior: "smooth", block: "start"});
                    }
                }
            });

            setEditor(editor);

            const model = editor.getModel();
            model?.onDidChangeContent(() => {
                const content = model.getValue();
                setContent(content);
            });
        }
        // Listen window resize event
        const resize = () => {
            editor?.layout();
        };
        window.addEventListener("resize", resize);
        return () => {
            editor?.dispose();
            window.removeEventListener("resize", resize);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [monaco, setContent]);

    useEffect(() => {
        editor?.setValue(initContent);
    }, [editor, initContent]);

    useEffect(() => {
        editor?.updateOptions({
            theme: currentColorMode === "dark" ? "vs-dark" : "vs",
        });
    }, [currentColorMode, editor]);

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
