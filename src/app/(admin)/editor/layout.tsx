import NoScroll from "./NoScroll";
import {ReactNode} from "react";

interface EditorPageLayoutProps {
    children: ReactNode;
}

async function EditorPageLayout({children}: EditorPageLayoutProps) {
    return (
        <NoScroll>
            {children}
        </NoScroll>
    );
}

export default EditorPageLayout;
