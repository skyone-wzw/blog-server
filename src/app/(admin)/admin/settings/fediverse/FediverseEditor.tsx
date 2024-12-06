"use client";

import {FediverseDynamicConfig} from "@/lib/config";
import {RegenerateFediverseKeyPair, SaveFediverseConfigAction, SaveProfileActionState} from "@/lib/config-actions";
import {useActionState, useEffect, useRef, useState} from "react";
import {useFormStatus} from "react-dom";
import DangerousButton from "@/components/DangerousButton";

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
            disabled={pending} type="submit" value="保存联邦配置"/>
    );
}

interface FediverseEditorProps {
    fediverse: FediverseDynamicConfig;
}

function FediverseEditor({fediverse}: FediverseEditorProps) {
    const [enabled, setEnabled] = useState(false);
    const [name, setName] = useState("");
    const [preferredUsername, setPreferredUsername] = useState("");
    const [summary, setSummary] = useState("");
    const [loading, setLoading] = useState(false);

    const [formState, formAction] = useActionState(SaveFediverseConfigAction, initialState);

    useEffect(() => {
        setEnabled(fediverse.enabled);
        setName(fediverse.name ?? "");
        setPreferredUsername(fediverse.preferredUsername);
        setSummary(fediverse.summary ?? "");
    }, [fediverse]);

    useEffect(() => {
        if (formState.timestamp > 0) {
            if (formState.error) {
                alert(`保存失败：${formState.message}`);
            } else {
                alert("保存成功！");
            }
        }
    }, [formState]);

    const handleRegenerateKeyPair = () => {
        setLoading(true);
        RegenerateFediverseKeyPair().then((result) => {
            setLoading(false);
            if (result) {
                alert("密钥已重置");
            } else {
                alert("密钥重置失败，服务器发生未知错误");
            }
        });
    };

    return (
        <>
            <form className="bg-bg-light rounded-lg shadow p-6 space-y-4" action={formAction}>
                <h1 className="text-lg pb-2 mb-4 font-semibold text-text-main border-b-bg-tag border-b-[1px] border-solid">
                    联邦配置
                </h1>
                <div className="w-full">
                    <label htmlFor="fediverse-editor-enabled"
                           className="block text-base font-medium leading-6 text-text-content">
                        启用联邦
                        <p className="text-sm text-text-subnote">
                            启用联邦后，您将会收到来自联邦的评论，目前不会将正文同步到联邦
                        </p>
                    </label>
                    <div className="mt-1">
                        <input id="fediverse-editor-enabled" type="text" readOnly className="hidden" name="enabled" value={enabled ? "true" : "false"}/>
                        <button type="button" onClick={() => setEnabled(!enabled)}
                                className={`rounded-md bg-button-bg px-3 py-2 text-sm text-button-text shadow-sm hover:bg-button-hover`}>
                            {enabled ? "已启用" : "未启用"}
                        </button>
                    </div>
                </div>
                <div className="w-full">
                    <label htmlFor="fediverse-editor-name"
                           className="block text-base font-medium leading-6 text-text-content">
                        昵称
                        <p className="text-sm text-text-subnote">
                            昵称将会显示在联邦协议中，留空则使用个人资料中的昵称
                        </p>
                    </label>
                    <div className="mt-1">
                        <input id="fediverse-editor-name" type="text" name="name"
                               value={name} onChange={e => setName(e.target.value)}
                               className="block w-[520px] max-w-full text-sm shadow appearance-none border rounded py-2 px-3 bg-bg-light text-text-content focus:outline-none focus:shadow-link-content focus:border-link-content"/>
                    </div>
                </div>
                <div className="w-full">
                    <label htmlFor="fediverse-editor-preferred-username"
                           className="block text-base font-medium leading-6 text-text-content">
                        联邦 ID
                        <p className="text-sm text-text-subnote">
                            <span className="font-bold">必填</span>
                            ，联邦 ID 用于唯一标识您的账户，只能包含字母、数字、下划线和短横线
                        </p>
                    </label>
                    <div className="mt-1">
                        <input id="fediverse-editor-preferred-username" type="text" required name="preferredUsername"
                               value={preferredUsername} onChange={e => setPreferredUsername(e.target.value)}
                               className="block w-[520px] max-w-full text-sm shadow appearance-none border rounded py-2 px-3 bg-bg-light text-text-content focus:outline-none focus:shadow-link-content focus:border-link-content"/>
                    </div>
                </div>
                <div className="w-full">
                    <label htmlFor="fediverse-editor-summary"
                           className="block text-base font-medium leading-6 text-text-content">
                        个人简介
                        <p className="text-sm text-text-subnote">
                            个人简介将会显示在联邦协议中
                        </p>
                    </label>
                    <div className="mt-1">
                    <textarea id="fediverse-editor-summary" name="summary"
                              value={summary} onChange={e => setSummary(e.target.value)}
                              className="block w-[520px] max-w-full text-sm shadow appearance-none border rounded py-2 px-3 bg-bg-light text-text-content focus:outline-none focus:shadow-link-content focus:border-link-content"/>
                    </div>
                </div>
                <SubmitButton/>

                <div className="w-full pt-16">
                    <label htmlFor="fediverse-editor-summary"
                           className="block text-base font-medium leading-6 text-text-content">
                        重新生成密钥对
                    </label>
                    <div className="mt-2">
                        <DangerousButton
                            disabled={loading}
                            className="rounded-md bg-button-bg px-3 py-2 text-sm text-button-text shadow-sm hover:bg-button-hover disabled:bg-bg-hover"
                            onClick={handleRegenerateKeyPair}>
                            重新生成
                        </DangerousButton>
                    </div>
                </div>

            </form>

        </>
    );
}

export default FediverseEditor;
