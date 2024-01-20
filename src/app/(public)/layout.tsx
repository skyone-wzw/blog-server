import AppFooter from "@/components/layout/footer/AppFooter";
import {ReactNode} from "react";

interface PublicPageLayoutProps {
    children: ReactNode;
}

function PublicPageLayout({children}: PublicPageLayoutProps) {
    return (
        <>
            {children}
            <AppFooter className="row-start-3"/>
        </>
    );
}

export default PublicPageLayout;
