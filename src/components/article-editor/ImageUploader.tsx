"use client";

import Paper from "@/components/base/Paper";
import {UploadImageAction} from "@/lib/actions";
import {useState} from "react";

interface ImageUploaderProps {
    className?: string;
}

function ImageUploader({className}: ImageUploaderProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<string>("");

    const handleUpload = async (formData: FormData) => {
        const fileField = formData.get("file");
        if (!fileField || !(fileField instanceof File)) return;
        setIsLoading(true);
        const result = await UploadImageAction(formData);
        setIsLoading(false);
        setResult(result);
    };

    const handleChangeFile = () => {
        setResult("");
    };

    const copyToClipboard = () => {
        if (!result) return;
        navigator.clipboard.writeText(`![](${result})`);
    };

    return (
        <Paper className={className}>
            <form className="p-4 max-w-full w-[480px] flex flex-col gap-y-4" action={handleUpload}>
                <div className="pb-4 text-text-main">上传图片</div>
                <input
                    aria-label="上传图片" onChange={handleChangeFile}
                    className="block w-full p-6 text-sm text-text-content border rounded-lg cursor-pointer bg-bg-light dark:text-gray-400 focus:outline-none"
                    id="article-editor-upload-image" name="file" type="file"
                    accept="image/webp,image/png,image/jpeg"/>
                <pre
                    className="text-sm overflow-auto text-text-content flex flex-row justify-between items-center gap-x-1">
                    <p className="flex-grow w-0 overflow-x-auto xc-scroll">{result ? `上传成功: ${result}` : isLoading ? "上传中..." : "\xa0"}</p>
                    {result && (
                        <button
                            type="button" onClick={copyToClipboard}
                            className="rounded-md bg-bg-quote px-3 py-2 text-sm text-text-content shadow-sm hover:bg-bg-hover">
                            <svg stroke="currentColor" fill="currentColor" viewBox="0 0 448 512" height="1em"
                                 width="1em"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M320 448v40c0 13.255-10.745 24-24 24H24c-13.255 0-24-10.745-24-24V120c0-13.255 10.745-24 24-24h72v296c0 30.879 25.121 56 56 56h168zm0-344V0H152c-13.255 0-24 10.745-24 24v368c0 13.255 10.745 24 24 24h272c13.255 0 24-10.745 24-24V128H344c-13.2 0-24-10.8-24-24zm120.971-31.029L375.029 7.029A24 24 0 0 0 358.059 0H352v96h96v-6.059a24 24 0 0 0-7.029-16.97z"/>
                            </svg>
                        </button>
                    )}
                </pre>
                <input
                    type="submit" disabled={isLoading} value="上传"
                    className="w-full rounded-md bg-button-bg px-3 py-2 text-sm text-button-text shadow-sm hover:bg-button-hover disabled:bg-bg-hover"/>
            </form>
        </Paper>
    );
}

export default ImageUploader;
