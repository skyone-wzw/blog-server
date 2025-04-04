"use client";

import {ProfileDynamicConfig} from "@/lib/config";
import {SaveProfileActionState, SaveProfileConfigAction} from "@/lib/config-actions";
import L from "@/lib/links";
import Image from "next/image";
import {useActionState, useEffect, useRef, useState} from "react";
import {useFormStatus} from "react-dom";
import {useTranslations} from "next-intl";

const initialState: SaveProfileActionState = {
    error: false,
    message: "",
    timestamp: 0,
};

function SubmitButton() {
    const {pending} = useFormStatus();
    const t = useTranslations("page.admin.settings.ProfileEditor");

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
            className="rounded-md bg-button-bg px-3 py-2 text-sm text-button-text shadow-xs hover:bg-button-hover disabled:bg-bg-hover"
            disabled={pending} type="submit" value={t("save")}/>
    );
}

interface ProfileEditorProps {
    profile: ProfileDynamicConfig;
}

function ProfileEditor({profile}: ProfileEditorProps) {
    const [name, setName] = useState(profile.name);
    const [avatar, setAvatar] = useState<File>();
    const [cover, setCover] = useState<File>();
    const [description, setDescription] = useState(profile.description);
    const [email, setEmail] = useState(profile.email);
    const [github, setGithub] = useState(profile.social.github ?? "");
    const [zhihu, setZhihu] = useState(profile.social.zhihu ?? "");
    const t = useTranslations("page.admin.settings.ProfileEditor");

    const avatarSelectorRef = useRef<HTMLInputElement>(null);
    const coverSelectorRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setName(profile.name);
        setDescription(profile.description);
        setEmail(profile.email);
        setGithub(profile.social.github ?? "");
        setZhihu(profile.social.zhihu ?? "");
    }, [profile]);

    const [formState, formAction] = useActionState(SaveProfileConfigAction, initialState);

    useEffect(() => {
        if (formState.timestamp > 0) {
            if (formState.error) {
                alert(t("alter.error", {message: formState.message}));
            } else {
                alert(t("alter.success"));
            }
        }
    }, [t, formState]);

    const getAvatarPreview = () => {
        if (avatar) {
            return URL.createObjectURL(avatar);
        }
        return L.image.custom(profile.avatar);
    };

    const handleAvatarClick = () => {
        if (avatarSelectorRef.current) {
            avatarSelectorRef.current.click();
        }
    };

    const getCoverPreview = () => {
        if (cover) {
            return URL.createObjectURL(cover);
        }
        return L.image.custom(profile.cover);
    };

    const handleCoverClick = () => {
        if (coverSelectorRef.current) {
            coverSelectorRef.current.click();
        }
    };

    return (
        <form className="bg-bg-light rounded-lg shadow-sm p-6 space-y-4" action={formAction}>
            <h1 className="text-lg pb-2 mb-4 font-semibold text-text-main border-b-bg-tag border-b-[1px] border-solid">
                {t("title")}
            </h1>
            <div className="w-full">
                <label htmlFor="profile-editor-avatar"
                       className="block text-base font-medium leading-6 text-text-content">
                    {t("avatar")}
                </label>
                <div className="mt-1">
                    <input ref={avatarSelectorRef} id="profile-editor-avatar" type="file" name="avatar"
                           onChange={e => setAvatar(e.target.files?.[0])}
                           className="hidden" accept="image/webp,image/png,image/jpeg"/>
                    <Image className="object-cover rounded-full border-2 border-bg-tag w-[160px] h-[160px]"
                           onClick={handleAvatarClick} priority
                           src={getAvatarPreview()} height={160} width={160} alt="Avatar"/>
                </div>
            </div>
            <div className="w-full">
                <label htmlFor="profile-editor-name"
                       className="block text-base font-medium leading-6 text-text-content">
                    {t("name")}
                </label>
                <div className="mt-1">
                    <input id="profile-editor-name" type="text" required name="name"
                           value={name} onChange={e => setName(e.target.value)}
                           className="block w-[520px] max-w-full text-sm shadow-sm appearance-none border rounded-sm py-2 px-3 bg-bg-light text-text-content focus:outline-hidden focus:shadow-link-content focus:border-link-content"/>
                </div>
            </div>
            <div className="w-full">
                <label htmlFor="profile-editor-email"
                       className="block text-base font-medium leading-6 text-text-content">
                    {t("email")}
                </label>
                <div className="mt-1">
                    <input id="profile-editor-email" required name="email"
                           value={email} onChange={e => setEmail(e.target.value)}
                           className="block w-[520px] max-w-full text-sm shadow-sm appearance-none border rounded-sm py-2 px-3 bg-bg-light text-text-content focus:outline-hidden focus:shadow-link-content focus:border-link-content"/>
                </div>
            </div>
            <div className="w-full">
                <label htmlFor="profile-editor-cover"
                       className="block text-base font-medium leading-6 text-text-content">
                    {t("cover")}
                </label>
                <div className="mt-1">
                    <input ref={coverSelectorRef} id="profile-editor-cover" type="file" name="cover"
                           onChange={e => setCover(e.target.files?.[0])}
                           className="hidden" accept="image/webp,image/png,image/jpeg"/>
                    <Image className="w-[520px] max-w-full aspect-3/1 object-cover rounded-sm border-2 border-bg-tag"
                           onClick={handleCoverClick}
                           src={getCoverPreview()} height={200} width={600} alt="Avatar"/>
                </div>
            </div>
            <div className="w-full">
                <label htmlFor="profile-editor-description"
                       className="block text-base font-medium leading-6 text-text-content">
                    {t("description")}
                </label>
                <div className="mt-1">
                    <textarea id="profile-editor-description" name="description"
                              value={description} onChange={e => setDescription(e.target.value)}
                              className="block w-[520px] h-16 max-w-full text-sm shadow-sm appearance-none border rounded-sm py-2 px-3 bg-bg-light text-text-content focus:outline-hidden focus:shadow-link-content focus:border-link-content"/>
                </div>
            </div>
            <div className="w-full">
                <p className="block text-base font-medium leading-6 text-text-content">{t("social.title")}</p>
                <div className="mt-1 flex flex-row flex-nowrap items-center w-[520px] max-w-full">
                    <label htmlFor="profile-editor-social-github"
                           className="w-16 text-sm font-medium leading-6 text-text-content">
                        {t("social.github")}
                    </label>
                    <input id="profile-editor-social-github" name="social-github" type="text"
                           value={github} onChange={e => setGithub(e.target.value)}
                           className="grow text-sm shadow-sm appearance-none border rounded-sm py-2 px-3 bg-bg-light text-text-content focus:outline-hidden focus:shadow-link-content focus:border-link-content"/>
                </div>
                <div className="mt-1 flex flex-row flex-nowrap items-center w-[520px] max-w-full">
                    <label htmlFor="profile-editor-social-zhihu"
                           className="w-16 text-sm font-medium leading-6 text-text-content">
                        {t("social.zhihu")}
                    </label>
                    <input id="profile-editor-social-zhihu" name="social-zhihu" type="text"
                           value={zhihu} onChange={e => setZhihu(e.target.value)}
                           className="grow text-sm shadow-sm appearance-none border rounded-sm py-2 px-3 bg-bg-light text-text-content focus:outline-hidden focus:shadow-link-content focus:border-link-content"/>
                </div>
            </div>
            <SubmitButton/>
        </form>
    );
}

export default ProfileEditor;
