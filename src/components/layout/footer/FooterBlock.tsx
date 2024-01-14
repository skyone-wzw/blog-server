import {ReactNode} from "react";

interface FooterBlockProps {
    children: ReactNode;
}

function FooterBlock({children}: FooterBlockProps) {
    return (
        <div className="mt-2">
            {children}
        </div>
    );
}

export default FooterBlock;
