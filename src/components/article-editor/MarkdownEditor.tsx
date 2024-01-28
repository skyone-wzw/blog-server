"use client";

import MarkdownPreview from "@/components/article-editor/MarkdownPreview";
import Paper from "@/components/base/Paper";
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
                console.log("destroy");
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
            editor.current.dispatch({
                changes: {from: 0, to: editor.current.state.doc.length, insert: PrevContent},
            });
        }
    }, [PrevContent, editor]);

    return (
        <div className={clsx("flex flex-row gap-x-4", className)}>
            <div
                ref={inputRef}
                className={clsx("w-0 flex-grow resize-none text-sm lg:text-base rounded-lg", {
                    "hidden xl:block": isPreview,
                    "block": !isPreview,
                })}/>
            <Paper
                className={clsx(isPreview ? "block" : "hidden xl:block", "w-0 flex-grow p-4 text-sm 2xl:text-base overflow-auto pk-scroll")}>
                <MarkdownPreview content={content}/>
            </Paper>
        </div>
    );
}

export default MarkdownEditor;
