import {ReactNode} from "react";

interface EditorCustomPageLayoutProps {
    left: ReactNode;
    children: ReactNode;
}

async function EditorCustomPageLayout({left, children}: EditorCustomPageLayoutProps) {
    return (
        <div className="flex flex-row px-2 py-4 row-start-2 row-span-2">
            {left}
            {children}
        </div>
    );
}

export default EditorCustomPageLayout;
