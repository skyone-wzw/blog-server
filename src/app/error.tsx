"use client";

import AppFooter from "@/components/layout/footer/AppFooter";
import {useTranslations} from "next-intl";

function ErrorIcon({className}: { className?: string }) {
    return (
        <svg fill="currentColor" viewBox="0 0 24 24" className={className}
             height="24px" width="24px" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path>
        </svg>
    );
}

interface ErrorPageProps {
    error: Error & { digest?: string };
    reset: () => void;
}

function ErrorPage({error, reset}: ErrorPageProps) {
    const t = useTranslations("page.error");
    return (
        <>
            <section className="row-start-2 col-span-full h-full pb-6 px-4 flex flex-col justify-center items-center">
                <ErrorIcon className="w-16 h-16 text-text-content fill-current"/>
                <div
                    className="mt-6 text-center max-w-full max-h-[90vh] w-[480px] lg:w-[640px] xl:w-[960px] justify-center items-center">
                    <p className="mb-4 text-2xl text-text-main">{t("title")}</p>
                    <p className="mb-2 font-mono text-md text-text-subnote">{error.message}</p>
                    {error.digest &&
                        <p className="mb-2 font-mono text-md text-text-subnote">Error digest: {error.digest}</p>}
                    {t.rich("description", {
                        p: (children) => <p className="mb-6 text-md text-text-subnote">{children}</p>
                    })}
                    <div className="flex flex-row gap-x-4 justify-center">
                        <button
                            className="rounded-md bg-button-bg px-6 py-2 text-sm text-button-text shadow-xs hover:bg-button-hover"
                            onClick={reset}>
                            {t("retry")}
                        </button>
                        <button
                            className="rounded-md bg-button-bg px-6 py-2 text-sm text-button-text shadow-xs hover:bg-button-hover"
                            onClick={() => window.location.reload()}>
                            {t("reload")}
                        </button>
                    </div>
                </div>
            </section>
            <AppFooter/>
        </>
    );
}

export default ErrorPage;
