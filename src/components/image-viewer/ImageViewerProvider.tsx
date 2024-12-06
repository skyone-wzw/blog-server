"use client";

import {createContext, ReactNode, useCallback, useContext, useState} from "react";
import Dialog from "@/components/base/Dialog";

interface ImageViewerContextValue {
    open: (image: string) => void;
}

export const ImageViewerContext = createContext<ImageViewerContextValue>(undefined!);

interface ImageViewerProviderProps {
    children: ReactNode;
}

function ImageViewerProvider({children}: ImageViewerProviderProps) {
    const [image, setImage] = useState<string | null>();

    const handleOpen = useCallback(
        (image: string) => {
            setImage(image);
        }, [],
    );

    const open = !!image;
    const handleClose = useCallback(() => {
        setImage(null);
    }, []);

    return (
        <ImageViewerContext.Provider value={{open: handleOpen}}>
            {children}
            <Dialog className="z-20 focus-visible:outline-none w-full h-full"
                    boxClassName="h-full w-full flex justify-center items-center"
                    clickOutsideClose clickInsideClose blur open={open} onClose={handleClose}>
                {image && <img src={image} alt="Image Viewer" onClick={handleClose}
                               className="max-w-full max-h-full w-auto h-auto"/>}
            </Dialog>
        </ImageViewerContext.Provider>
    );
}

export default ImageViewerProvider;

export function useImageViewer() {
    return useContext(ImageViewerContext);
}
