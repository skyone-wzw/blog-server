import AppFooter from "@/components/layout/footer/AppFooter";
import {useTranslations} from "next-intl";

function NotFoundIcon({className}: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={className}>
            <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-2.5 7.51-3.49L17.5 6.5 9.99 9.99 6.5 17.5zm5.5-6.6c.61 0 1.1.49 1.1 1.1s-.49 1.1-1.1 1.1-1.1-.49-1.1-1.1.49-1.1 1.1-1.1z"/>
        </svg>
    );
}

function NotFoundPage() {
    const t = useTranslations("page.not-found");
    return (
        <>
            <section className="row-start-2 col-span-full h-full pb-6 flex flex-col justify-center items-center">
                <NotFoundIcon className="w-16 h-16 text-text-content fill-current"/>
                <div className="mt-6 text-center space-y-2 max-w-full">
                    <p className="text-2xl text-text-main">{t("title")}</p>
                    {t.rich("description", {
                        p: (content) => <p className="text-md text-text-subnote">{content}</p>
                    })}
                </div>
            </section>
            <AppFooter/>
        </>
    );
}

export default NotFoundPage;
