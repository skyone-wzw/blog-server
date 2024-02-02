"use client";

import {SiteDynamicConfig} from "@/lib/config";
import {SaveSiteConfigAction, SaveSiteConfigActionState} from "@/lib/config-actions";
import L from "@/lib/links";
import Image from "next/image";
import {useEffect, useRef, useState} from "react";
import {useFormState, useFormStatus} from "react-dom";

const initialState: SaveSiteConfigActionState = {
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
        }
        window.addEventListener("keydown", handleKeydown)
        return () => {
            window.removeEventListener("keydown", handleKeydown)
        }
    }, [formSubmitRef, pending]);

    return (
        <input
            ref={formSubmitRef}
            className="rounded-md bg-button-bg px-3 py-2 text-sm text-button-text shadow-sm hover:bg-button-hover disabled:bg-bg-hover"
            disabled={pending} type="submit" value="保存资料"/>
    );
}

interface SiteEditorProps {
    site: SiteDynamicConfig;
}

function SiteEditor({site}: SiteEditorProps) {
    const [title, setTitle] = useState(site.title);
    const [logo, setLogo] = useState<File>();
    const [description, setDescription] = useState(site.description);
    const [cover, setCover] = useState<File>();
    const [keywords, setKeywords] = useState(site.keywords);
    const [newKeyword, setNewKeyword] = useState("");

    const logoSelectorRef = useRef<HTMLInputElement>(null);
    const coverSelectorRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setTitle(site.title);
        setDescription(site.description);
        setKeywords(site.keywords);
    }, [site]);

    const [formState, formAction] = useFormState(SaveSiteConfigAction, initialState);

    useEffect(() => {
        if (formState.timestamp > 0) {
            if (formState.error) {
                alert(`保存失败：${formState.message}`);
            } else {
                setNewKeyword("");
                alert("保存成功！");
            }
        }
    }, [formState]);

    const getLogoPreview = () => {
        if (logo) {
            return URL.createObjectURL(logo);
        }
        return L.image.custom(site.logo);
    };

    const handleLogoClick = () => {
        if (logoSelectorRef.current) {
            logoSelectorRef.current.click();
        }
    };

    const getCoverPreview = () => {
        if (cover) {
            return URL.createObjectURL(cover);
        }
        return L.image.custom(site.cover);
    };

    const handleCoverClick = () => {
        if (coverSelectorRef.current) {
            coverSelectorRef.current.click();
        }
    };

    const setKeyword = (index: number, value: string) => {
        const newKeywords = [...keywords];
        newKeywords[index] = value;
        setKeywords(newKeywords);
    };

    const addKeyword = () => {
        if (newKeyword === "") return;
        setKeywords([...keywords, newKeyword]);
        setNewKeyword("");
    };

    const removeKeyword = (index: number) => {
        const newKeywords = [...keywords];
        newKeywords.splice(index, 1);
        setKeywords(newKeywords);
    };

    return (
        <form className="bg-bg-light rounded-lg shadow p-6 space-y-4" action={formAction}>
            <h1 className="text-lg pb-2 mb-4 font-semibold text-text-main border-b-bg-tag border-b-[1px] border-solid">
                网站信息
            </h1>
            <div className="w-full">
                <label htmlFor="site-editor-logo"
                       className="block text-base font-medium leading-6 text-text-content">
                    网站 Logo
                </label>
                <div className="mt-1">
                    <input ref={logoSelectorRef} id="site-editor-logo" type="file" name="logo"
                           onChange={e => setLogo(e.target.files?.[0])}
                           className="hidden" accept="image/webp,image/png,image/jpeg"/>
                    <Image className="object-cover border-2 border-bg-tag w-[160px] h-[160px]"
                           onClick={handleLogoClick} priority
                           src={getLogoPreview()} height={160} width={160} alt="Avatar"/>
                </div>
            </div>
            <div className="w-full">
                <label htmlFor="site-editor-title"
                       className="block text-base font-medium leading-6 text-text-content">
                    网站标题
                </label>
                <div className="mt-1">
                    <input id="site-editor-title" type="text" required name="title"
                           value={title} onChange={e => setTitle(e.target.value)}
                           className="block w-[520px] max-w-full text-sm shadow appearance-none border rounded py-2 px-3 bg-bg-light text-text-content focus:outline-none focus:shadow-link-content focus:border-link-content"/>
                </div>
            </div>
            <div className="w-full">
                <label htmlFor="site-editor-cover"
                       className="block text-base font-medium leading-6 text-text-content">
                    Open Graph 封面
                    <p className="text-sm text-text-subnote">为了使分享到社交软件时获得正确的封面，该图片一定要 1300x630
                        像素的 PNG 格式</p>
                </label>
                <div className="mt-1">
                    <input ref={coverSelectorRef} id="site-editor-cover" type="file" name="cover"
                           onChange={e => setCover(e.target.files?.[0])}
                           className="hidden" accept="image/webp,image/png,image/jpeg"/>
                    <Image className="w-[520px] max-w-full aspect-[130/63] object-cover rounded border-2 border-bg-tag"
                           onClick={handleCoverClick}
                           src={getCoverPreview()} height={1300} width={630} alt="Avatar"/>
                </div>
            </div>
            <div className="w-full">
                <label htmlFor="site-editor-description"
                       className="block text-base font-medium leading-6 text-text-content">
                    网站简介
                </label>
                <div className="mt-1">
                    <textarea id="site-editor-description" name="description"
                              value={description} onChange={e => setDescription(e.target.value)}
                              className="block w-[520px] h-16 max-w-full text-sm shadow appearance-none border rounded py-2 px-3 bg-bg-light text-text-content focus:outline-none focus:shadow-link-content focus:border-link-content"/>
                </div>
            </div>
            <div className="w-full">
                <p className="block text-base font-medium leading-6 text-text-content">网站 Keywords</p>
                {keywords.map((keyword, index) => (
                    <div key={`keyword-${index}`}
                         className="mt-1 flex flex-row flex-nowrap items-center w-[520px] max-w-full">
                        <input id="site-editor-keywords" aria-label="输入 Keyword" name="keywords[]" type="text"
                               value={keyword} onChange={e => setKeyword(index, e.target.value)}
                               className="flex-grow text-sm shadow appearance-none border rounded py-2 px-3 bg-bg-light text-text-content focus:outline-none focus:shadow-link-content focus:border-link-content"/>
                        <button
                            className="ml-4 rounded-md outline outline-1 outline-button-bg bg-bg-light hover:bg-bg-hover px-3 py-2 text-sm text-button-text shadow-sm"
                            type="button" onClick={() => removeKeyword(index)}>
                            删除
                        </button>
                    </div>
                ))}
                <div className="mt-1 flex flex-row flex-nowrap items-center w-[520px] max-w-full">
                    <input id="site-editor-keywords" aria-label="输入 Keyword" name="keywords[]" type="text"
                           value={newKeyword} onChange={e => setNewKeyword(e.target.value)}
                           className="flex-grow text-sm shadow appearance-none border rounded py-2 px-3 bg-bg-light text-text-content focus:outline-none focus:shadow-link-content focus:border-link-content"/>
                    <button
                        className="ml-4 rounded-md outline outline-1 outline-button-bg bg-bg-light hover:bg-bg-hover px-3 py-2 text-sm text-button-text shadow-sm"
                        type="button" onClick={() => addKeyword()}>
                        添加
                    </button>
                </div>
            </div>
            <SubmitButton/>
        </form>
    );
}

export default SiteEditor;
