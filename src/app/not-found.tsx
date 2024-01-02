import AppFooter from "@/components/layout/footer/AppFooter";

function NotFoundIcon({className}: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={className}>
            <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-2.5 7.51-3.49L17.5 6.5 9.99 9.99 6.5 17.5zm5.5-6.6c.61 0 1.1.49 1.1 1.1s-.49 1.1-1.1 1.1-1.1-.49-1.1-1.1.49-1.1 1.1-1.1z"/>
        </svg>
    );
}

function NotFoundPage() {
    return (
        <>
            <section className="col-span-full h-full pb-6 flex flex-col justify-center items-center">
                <NotFoundIcon className="w-16 h-16 text-text-content fill-current"/>
                <div className="mt-6 text-center space-y-2">
                    <p className="text-2xl text-text-main">找不到页面</p>
                    <p className="text-md text-text-subnote">我们找不到您要找的页面。</p>
                    <p className="text-md text-text-subnote">请联系原始链接来源网站的所有者，并告知他们链接已损坏。</p>
                </div>
            </section>
            <AppFooter/>
        </>
    );
}

export default NotFoundPage;
