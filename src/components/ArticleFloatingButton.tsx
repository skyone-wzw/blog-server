"use client";

import Dialog from "@/components/base/Dialog";
import Paper from "@/components/base/Paper";
import clsx from "clsx";
import Link from "next/link";
import {MouseEventHandler, ReactNode, useState} from "react";

interface ArticleFloatingButtonProps {
    toc?: ReactNode;
    className?: string;
}

function ArticleFloatingButton({toc, className}: ArticleFloatingButtonProps) {
    const [openToc, setOpenToc] = useState(false);

    const handleOpenToc: MouseEventHandler = (e) => {
        e.stopPropagation();
        setOpenToc(true);
    };
    const handleCloseToc = () => setOpenToc(false);

    const scrollToTop: MouseEventHandler<HTMLAnchorElement> = (e) => {
        e.preventDefault();

        window.scrollTo({top: 0, behavior: "smooth"});
    };

    return (
        <div className={clsx("fixed z-10 flex flex-col right-4 bottom-4 lg:right-8 lg:bottom-8 gap-y-2", className)}>
            {toc && (
                <>
                    <div className="rounded-lg p-3 md:p-4 shadow-md bg-bg-tag hover:text-link-hover md:hidden"
                         onClick={handleOpenToc}>
                        <svg fill="currentColor" viewBox="0 0 24 24" height={20} width={20}
                             xmlns="http://www.w3.org/2000/svg">
                            <path fill="none" d="M0 0h24v24H0z"/>
                            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
                        </svg>
                    </div>
                    <Dialog open={openToc} onClose={handleCloseToc} className="md:hidden w-full m-0" clickOutsideClose>
                        <Paper className="fixed bottom-4 left-4 right-4 p-4 text-sm">
                            <p className="mb-3 text-text-subnote">文章目录</p>
                            <div className="p-1.5 overflow-auto xc-scroll floating-toc" onClick={handleCloseToc}>
                                {toc}
                            </div>
                        </Paper>
                    </Dialog>
                </>
            )}
            <Link href={"#article-content-main"} title="返回顶部"
                  className="rounded-lg p-3 md:p-4 shadow-md bg-bg-tag text-text-content hover:text-link-hover"
                  onClick={scrollToTop}>
                <svg fill="currentColor" viewBox="0 0 24 24" height={20} width={20} xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M4 21.25a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H4.75a.75.75 0 0 1-.75-.75ZM5.22 9.53a.749.749 0 0 1 0-1.06l6.25-6.25a.749.749 0 0 1 1.06 0l6.25 6.25a.749.749 0 1 1-1.06 1.06l-4.97-4.969V16.75a.75.75 0 0 1-1.5 0V4.561L6.28 9.53a.749.749 0 0 1-1.06 0Z"></path>
                </svg>
            </Link>
        </div>
    );
}

export default ArticleFloatingButton;
