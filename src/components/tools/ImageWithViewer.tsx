"use client";

import {ImgHTMLAttributes, MouseEventHandler} from "react";
import Image, {ImageProps} from "next/image";
import {useImageViewer} from "@/components/image-viewer/ImageViewerProvider";

interface ImageWithViewerProps extends ImageProps {
    onClick: never;
    src: string;
}

export function ImageWithViewer({src, alt, ...other}: ImageWithViewerProps) {
    const {open} = useImageViewer();
    const handleClick: MouseEventHandler<HTMLImageElement> = (e) => {
        e.stopPropagation();
        e.preventDefault();
        open(src);
    };
    return (
        <Image {...other} src={src} alt={alt} onClick={handleClick}/>
    );
}

interface ImgWithViewerProps extends ImgHTMLAttributes<HTMLImageElement> {

}

export function ImgWithViewer({src, alt, ...other}: ImgWithViewerProps) {
    const {open} = useImageViewer();
    const handleClick: MouseEventHandler<HTMLImageElement> = (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (!src) return;
        open(src);
    };
    return (
        <img {...other} src={src} alt={alt} onClick={handleClick}/>
    );
}
