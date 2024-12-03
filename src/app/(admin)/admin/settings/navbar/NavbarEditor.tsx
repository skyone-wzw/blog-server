"use client";

import Paper from "@/components/base/Paper";
import {defaultDynamicConfig, NavbarDynamicConfig} from "@/lib/config";
import {SaveNavbarConfigAction, SaveProfileActionState} from "@/lib/config-actions";
import {useActionState, useEffect, useRef, useState} from "react";
import {useFormStatus} from "react-dom";

const initialState: SaveProfileActionState = {
    error: false,
    message: "",
    timestamp: 0,
};

function SubmitButton() {
    const {pending} = useFormStatus();

    const formSubmitRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleKeydown = (e: KeyboardEvent) => {
            // ctr + s
            if (!pending && formSubmitRef.current && e.ctrlKey && e.key === "s") {
                e.preventDefault();
                formSubmitRef.current.click();
            }
        };
        window.addEventListener("keydown", handleKeydown);
        return () => {
            window.removeEventListener("keydown", handleKeydown);
        };
    }, [formSubmitRef, pending]);

    return (
        <input
            ref={formSubmitRef}
            className="rounded-md bg-button-bg px-3 py-2 text-sm text-button-text shadow-sm hover:bg-button-hover disabled:bg-bg-hover"
            disabled={pending} type="submit" value="保存导航栏"/>
    );
}

interface NavbarEditorProps {
    navbar: NavbarDynamicConfig;
}

function NavbarEditor({navbar}: NavbarEditorProps) {
    const [items, setItems] = useState(navbar.items);
    const [newItem, setNewItem] = useState({name: "", url: ""});

    useEffect(() => {
        setItems(navbar.items);
    }, [navbar.items]);

    const [formState, formAction] = useActionState(SaveNavbarConfigAction, initialState);

    useEffect(() => {
        if (formState.timestamp > 0) {
            if (formState.error) {
                alert(`保存失败：${formState.message}`);
            } else {
                setNewItem({name: "", url: ""});
                alert("保存成功！");
            }
        }
    }, [formState]);

    const setItemName = (index: number, name: string) => {
        setItems(prev => {
            const newItems = [...prev];
            newItems[index].name = name;
            return newItems;
        });
    };

    const setItemUrl = (index: number, url: string) => {
        setItems(prev => {
            const newItems = [...prev];
            newItems[index].url = url;
            return newItems;
        });
    };

    const setNewItemName = (name: string) => {
        setNewItem(prev => ({...prev, name}));
    };

    const setNewItemUrl = (url: string) => {
        setNewItem(prev => ({...prev, url}));
    };

    const addNewItem = () => {
        setItems(prev => [...prev, newItem]);
        setNewItem({name: "", url: ""});
    };

    const removeItem = (index: number) => {
        setItems(prev =>
            prev.filter((_, i) => i !== index));
    };

    const restoreDefault = () => {
        setItems(defaultDynamicConfig.navbar.items);
        setNewItem({name: "", url: ""});
    };

    return (
        <>
            <Paper className="p-6">
                <span className="text-text-content text-lg mr-3">编辑导航栏</span>
                <p className="text-sm text-text-subnote">导航栏显示于顶部，建议不超过 6 个</p>
            </Paper>
            <form className="bg-bg-light rounded-lg shadow p-6 space-y-4" action={formAction}>
                {items.map((item, index) => (
                    <div key={`item-${index}`}
                         className="mt-1 flex flex-row flex-nowrap items-center w-[720px] max-w-full">
                        <input id={`navbar-name-${index}`} aria-label="输入链接名称" name={`name-${index}`} type="text"
                               value={item.name} onChange={e => setItemName(index, e.target.value)}
                               className="w-0 flex-grow text-sm shadow appearance-none border rounded py-2 px-3 bg-bg-light text-text-content focus:outline-none focus:shadow-link-content focus:border-link-content"/>
                        <input id={`navbar-url-${index}`} aria-label="输入链接" name={`url-${index}`} type="text"
                               value={item.url} onChange={e => setItemUrl(index, e.target.value)}
                               className="ml-4 w-0 flex-grow text-sm shadow appearance-none border rounded py-2 px-3 bg-bg-light text-text-content focus:outline-none focus:shadow-link-content focus:border-link-content"/>
                        <button
                            className="ml-4 rounded-md outline outline-1 outline-button-bg bg-bg-light hover:bg-bg-hover focus:bg-bg-hover px-3 py-2 text-sm text-text-content shadow-sm"
                            type="button" onClick={() => removeItem(index)}>
                            删除
                        </button>
                    </div>
                ))}
                <div className="mt-1 flex flex-row flex-nowrap items-center w-[720px] max-w-full">
                    <input id={`navbar-name-${items.length}`} aria-label="输入链接名称" name={`name-${items.length}`}
                           type="text"
                           value={newItem.name} onChange={e => setNewItemName(e.target.value)}
                           className="w-0 flex-grow text-sm shadow appearance-none border rounded py-2 px-3 bg-bg-light text-text-content focus:outline-none focus:shadow-link-content focus:border-link-content"/>
                    <input id={`navbar-url-${items.length}`} aria-label="输入链接" name={`url-${items.length}`}
                           type="text"
                           value={newItem.url} onChange={e => setNewItemUrl(e.target.value)}
                           className="ml-4 w-0 flex-grow text-sm shadow appearance-none border rounded py-2 px-3 bg-bg-light text-text-content focus:outline-none focus:shadow-link-content focus:border-link-content"/>
                    <button
                        className="ml-4 rounded-md outline outline-1 outline-button-bg bg-bg-light hover:bg-bg-hover focus:bg-bg-hover px-3 py-2 text-sm text-text-content shadow-sm"
                        type="button" onClick={addNewItem}>
                        添加
                    </button>
                </div>
                <div>
                    <SubmitButton/>
                    <button
                        className="ml-4 rounded-md outline outline-1 outline-button-bg bg-bg-light hover:bg-bg-hover px-3 py-2 text-sm text-text-content shadow-sm"
                        type="button" onClick={restoreDefault}>
                        恢复默认
                    </button>
                </div>
            </form>
        </>
    );
}

export default NavbarEditor;
