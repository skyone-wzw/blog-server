import {ReactNode} from "react";

interface EditorPageLayoutProps {
    left: ReactNode;
    children: ReactNode;
}

async function EditorPageLayout({left, children}: EditorPageLayoutProps) {
    return (
        <div className="flex flex-row px-2 py-4">
            {left}
            {children}
        </div>
    );
}

export default EditorPageLayout;
