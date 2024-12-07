"use client";

import {FediverseDynamicConfig} from "@/lib/config";
import {RegenerateFediverseKeyPair, SaveFediverseConfigAction, SaveProfileActionState} from "@/lib/config-actions";
import {useActionState, useEffect, useRef, useState} from "react";
import {useFormStatus} from "react-dom";
import DangerousButton from "@/components/DangerousButton";
import {useTranslations} from "next-intl";

const initialState: SaveProfileActionState = {
    error: false,
    message: "",
    timestamp: 0,
};

function SubmitButton() {
    const {pending} = useFormStatus();
    const t = useTranslations("page.admin.settings.FediverseEditor");

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
            disabled={pending} type="submit" value={t("save")}/>
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
    const t = useTranslations("page.admin.settings.FediverseEditor");

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
                alert(t("alert.error", {message: formState.message}));
            } else {
                alert(t("alert.success"));
            }
        }
    }, [t, formState]);

    const handleRegenerateKeyPair = () => {
        setLoading(true);
        RegenerateFediverseKeyPair().then((result) => {
            setLoading(false);
            if (result) {
                alert(t("alert.regenerateSuccess"));
            } else {
                alert(t("alert.regenerateError"));
            }
        });
    };

    return (
        <>
            <form className="bg-bg-light rounded-lg shadow p-6 space-y-4" action={formAction}>
                <h1 className="text-lg pb-2 mb-4 font-semibold text-text-main border-b-bg-tag border-b-[1px] border-solid">
                    {t("title")}
                </h1>
                {t.rich("description", {
                    p: (chunks) => <p className="text-text-content">{chunks}</p>,
                })}
                <div className="w-full">
                    <label htmlFor="fediverse-editor-enabled"
                           className="block text-base font-medium leading-6 text-text-content">
                        {t("enable")}
                        <p className="text-sm text-text-subnote">
                            {t("enableDescription")}
                        </p>
                    </label>
                    <div className="mt-1">
                        <input id="fediverse-editor-enabled" type="text" readOnly className="hidden" name="enabled"
                               value={enabled ? "true" : "false"}/>
                        <button type="button" onClick={() => setEnabled(!enabled)}
                                className={`rounded-md bg-button-bg px-3 py-2 text-sm text-button-text shadow-sm hover:bg-button-hover`}>
                            {enabled ? t("enabled") : t("disabled")}
                        </button>
                    </div>
                </div>
                <div className="w-full">
                    <label htmlFor="fediverse-editor-name"
                           className="block text-base font-medium leading-6 text-text-content">
                        {t("name")}
                        <p className="text-sm text-text-subnote">
                            {t("nameDescription")}
                        </p>
                    </label>
                    <div className="mt-1">
                        <input id="fediverse-editor-name" required type="text" name="name"
                               value={name} onChange={e => setName(e.target.value)}
                               className="block w-[520px] max-w-full text-sm shadow appearance-none border rounded py-2 px-3 bg-bg-light text-text-content focus:outline-none focus:shadow-link-content focus:border-link-content"/>
                    </div>
                </div>
                <div className="w-full">
                    <label htmlFor="fediverse-editor-preferred-username"
                           className="block text-base font-medium leading-6 text-text-content">
                        {t("preferredUsername")}
                        <p className="text-sm text-text-subnote">
                            {t.rich("preferredUsernameDescription", {
                                b: (chunks) => <span className="font-bold">{chunks}</span>,
                            })}
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
                        {t("summary")}
                        <p className="text-sm text-text-subnote">
                            {t("summaryDescription")}
                        </p>
                    </label>
                    <div className="mt-1">
                    <textarea id="fediverse-editor-summary" required name="summary"
                              value={summary} onChange={e => setSummary(e.target.value)}
                              className="block w-[520px] max-w-full text-sm shadow appearance-none border rounded py-2 px-3 bg-bg-light text-text-content focus:outline-none focus:shadow-link-content focus:border-link-content"/>
                    </div>
                </div>
                <SubmitButton/>

                <div className="w-full pt-16">
                    <label htmlFor="fediverse-editor-summary"
                           className="block text-base font-medium leading-6 text-text-content">
                        {t("regenerateKeyPair")}
                    </label>
                    <div className="mt-2">
                        <DangerousButton
                            disabled={loading}
                            className="rounded-md bg-button-bg px-3 py-2 text-sm text-button-text shadow-sm hover:bg-button-hover disabled:bg-bg-hover"
                            onClick={handleRegenerateKeyPair}>
                            {t("regenerate")}
                        </DangerousButton>
                    </div>
                </div>
            </form>
        </>
    );
}

export default FediverseEditor;
