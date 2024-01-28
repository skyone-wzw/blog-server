"use client";

import MarkdownPreview from "@/components/article-editor/MarkdownPreview";
import {markdown} from "@codemirror/lang-markdown";
import {Compartment, EditorState} from "@codemirror/state";
import {githubDark, githubLight} from "@uiw/codemirror-theme-github";
import clsx from "clsx";
import {basicSetup, EditorView} from "codemirror";
import {useEffect, useRef, useState} from "react";
import "./styles.css";

function getCurrentTheme() {
    const root = document.documentElement.classList;
    if (root.contains("dark")) {
        return githubDark;
    } else if (root.contains("light")) {
        return githubLight;
    } else {
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            return githubDark;
        } else {
            return githubLight;
        }
    }
}

interface MarkdownEditorProps {
    content: string;
    setContent: (content: string) => void;
    isPreview: boolean;
    className?: string;
}

function MarkdownEditor({content: PrevContent, setContent: setPrevContent, isPreview, className}: MarkdownEditorProps) {
    const [content, setContent] = useState("");
    const inputRef = useRef<HTMLDivElement>(null);
    const previewRef = useRef<HTMLDivElement>(null);
    const editor = useRef<EditorView>();

    useEffect(() => {
        if (inputRef.current && !editor.current) {
            const themeCompartment = new Compartment();
            editor.current = new EditorView({
                parent: inputRef.current,
                state: EditorState.create({
                    extensions: [
                        basicSetup,
                        markdown(),
                        themeCompartment.of(getCurrentTheme()),
                        EditorView.lineWrapping,
                        EditorView.updateListener.of((update) => {
                            if (update.docChanged) {
                                setPrevContent(update.state.doc.toString());
                                setContent(update.state.doc.toString());
                            }
                        }),
                    ],
                }),
            });

            const themeChangeListener = () => {
                editor.current?.dispatch({
                    effects: themeCompartment.reconfigure(getCurrentTheme()),
                });
            };
            const observer = new MutationObserver(themeChangeListener);
            observer.observe(document.documentElement, {
                attributes: true,
                attributeFilter: ["class"],
            });
            window.matchMedia("(prefers-color-scheme: dark)")
                .addEventListener("change", themeChangeListener);

            return () => {
                observer.disconnect();
                window.matchMedia("(prefers-color-scheme: dark)")
                    .removeEventListener("change", themeChangeListener);
                editor.current?.destroy();
                editor.current = undefined;
            };
        }
    }, [inputRef, editor, setContent, setPrevContent]);

    useEffect(() => {
        if (editor.current) {
            const Editor = editor.current!;
            let lastScrollTop = 0;
            const onScroll = () => {
                if (editor.current && previewRef.current && editor.current.scrollDOM.scrollTop !== lastScrollTop) {
                    const Editor = editor.current!;
                    const scrollTop = Editor.scrollDOM.scrollTop;
                    const block = Editor.lineBlockAtHeight(scrollTop)
                    const line = Editor.state.doc.lineAt(block.from).number;
                    const target = document.querySelector(`#article-editor-markdown-editor [data-line="${line}"]`);
                    if (target) {
                        previewRef.current.scrollTo({
                            top: (target as HTMLElement).offsetTop - 140,
                            behavior: "smooth",
                        });
                    }
                }
            }

            Editor.scrollDOM.addEventListener("scroll", onScroll)

            return () => {
                editor.current?.scrollDOM.removeEventListener("scroll", onScroll);
            }
        }
    }, [editor]);

    // useEffect(() => {
    //     if (editor.current && previewRef.current) {
    //         const Editor = editor.current!;
    //         const Preview = previewRef.current!;
    //
    //         let lastScrollTop = 0;
    //         const onScroll = () => {
    //             if (previewScroll > 0) return;
    //             if (editor.current && previewRef.current && Preview.scrollTop !== lastScrollTop) {
    //                 const Preview = previewRef.current!;
    //                 const scrollTop = Preview.scrollTop;
    //                 let target = -1;
    //                 Preview.querySelectorAll("#article-editor-markdown-editor [data-line]").forEach((child) => {
    //                     if ((child as HTMLElement).offsetTop > scrollTop && target === -1) {
    //                         const line = (child as HTMLElement).dataset?.["line"];
    //                         const lineNumber = line ? parseInt(line) : NaN;
    //                         if (!isNaN(lineNumber)) {
    //                             target = lineNumber;
    //                         }
    //                         return;
    //                     }
    //                 });
    //                 if (target !== -1 && !isNaN(target)) {
    //                     lastScrollTop = target;
    //                     editorScroll = Date.now();
    //                     cleanEditorScroll();
    //                     const from = Editor.state.doc.line(target).from
    //                     const top = Editor.coordsAtPos(from)?.top;
    //                     console.log(target, from, top);
    //                     top && Editor.scrollDOM.scrollTo({
    //                         top: top,
    //                         behavior: "smooth",
    //                     });
    //                 }
    //             }
    //         }
    //
    //         Preview.addEventListener("scroll", onScroll);
    //
    //         return () => {
    //             Preview?.removeEventListener("scroll", onScroll);
    //         }
    //     }
    // }, [editor, previewRef]);

    useEffect(() => {
        if (editor.current) {
            editor.current.dispatch({
                changes: {from: 0, to: editor.current.state.doc.length, insert: PrevContent},
            });
        }
    }, [PrevContent, editor]);

    return (
        <div
            id="article-editor-markdown-editor"
            className={clsx("flex flex-row gap-x-4", className)}>
            <div
                ref={inputRef}
                className={clsx("w-0 flex-grow resize-none text-sm lg:text-base rounded-lg", {
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
