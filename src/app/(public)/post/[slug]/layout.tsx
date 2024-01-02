import Container from "@/components/base/Container";
import "katex/dist/katex.css";
import {ReactNode, Suspense} from "react";
import "@/components/markdown/article.css";

interface PostPageLayoutProps {
    left: ReactNode;
    right: ReactNode;
    children: ReactNode;
}

function PostPageLayout({left, right, children}: PostPageLayoutProps) {
    return (
        <Container className="md:grid mx-0 md:gap-x-6 md:grid-cols-3 md:px-6 xl:grid-cols-4 pt-6 w-full">
            <main id="article-content-main" className="pb-6 col-start-2 order-2 col-span-2 space-y-6">
                {children}
            </main>
            <aside className="pb-6 order-1">
                <Suspense>
                    {left}
                </Suspense>
            </aside>
            <aside className="pb-6 order-3 hidden xl:block xl:col-start-4">
                <Suspense>
                    {right}
                </Suspense>
            </aside>
        </Container>
    );
}

export default PostPageLayout;
