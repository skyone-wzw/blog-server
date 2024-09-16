import {ReactNode} from "react";
import NoScroll from "./NoScroll";

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
