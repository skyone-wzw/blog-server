import Container from "@/components/base/Container";
import FooterBlock from "@/components/layout/footer/FooterBlock";
import YearNumber from "@/components/layout/footer/YearNumber";
import {getDynamicConfig} from "@/lib/config";
import clsx from "clsx";
import Link from "next/link";

interface AppFooterProps {
    className?: string;
}

async function AppFooter({className}: AppFooterProps) {
    const dynamicConfig = await getDynamicConfig();
    return (
        <footer className={clsx("bg-bg-light pt-12 pb-24 text-center md:px-6 row-start-3", className)}>
            <Container className="md:flex md:justify-between text-text-subnote">
                <FooterBlock>
                    Copyright © 2020{" - "}<YearNumber/>
                    <span className="mx-1 after:content-['·']"></span>
                    <Link className="text-text-main underline hover:text-link-hover" target="_blank"
                          href={dynamicConfig.site.url}>{dynamicConfig.profile.name}</Link>
                </FooterBlock>
                <FooterBlock>
                    {"Powered by "}
                    <Link className="text-text-main underline hover:text-link-hover" target="_blank"
                          href="https://nextjs.org">Next.js</Link>
                    <span className="mx-1 after:content-['·']"></span>
                    {"Designed by "}
                    <Link className="text-text-main underline hover:text-link-hover" target="_blank"
                          href="https://www.skyone.host/">skyone-wzw</Link>
                    {" & "}
                    <Link className="text-text-main underline hover:text-link-hover" target="_blank"
                          href="https://skk.moe/">Sukka</Link>
                </FooterBlock>
            </Container>
        </footer>
    );
}

export default AppFooter;
