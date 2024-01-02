import Container from "@/components/base/Container";
import FooterBlock from "@/components/layout/footer/FooterBlock";
import YearNumber from "@/components/layout/footer/YearNumber";
import Link from "next/link";

function AppFooter() {
    return (
        <footer className="bg-bg-light pt-12 pb-24 text-center md:px-6">
            <Container className="md:flex md:justify-between text-text-subnote">
                <FooterBlock>
                    Copyright © 2020{" - "}<YearNumber/>
                    <span className="mx-1 after:content-['·']"></span>
                    <Link className="text-text-main underline" href="https://github.com/skyone-wzw" target="_blank">skyone-wzw</Link>
                </FooterBlock>
                <FooterBlock>
                    {"Powered by "}
                    <Link className="text-text-main underline" href="https://nextjs.org" target="_blank">Next.js</Link>
                    <span className="mx-1 after:content-['·']"></span>
                    {"Designed by "}
                    <Link className="text-text-main underline" target="_blank"
                          href="https://blog.skyone.dev/">skyone-wzw</Link>
                    {" & "}
                    <Link className="text-text-main underline" target="_blank"
                          href="https://skk.moe/">Sukka</Link>
                </FooterBlock>
            </Container>
        </footer>
    );
}

export default AppFooter;
