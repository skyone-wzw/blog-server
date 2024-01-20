import Container from "@/components/base/Container";
import Flex from "@/components/base/Flex";
import HeaderColorToggle from "@/components/layout/header/HeaderColorToggle";
import HeaderLink from "@/components/layout/header/HeaderLink";
import Logo from "@/components/layout/header/Logo";
import config from "@/config";

interface IconProps {
    className?: string;
}

function EditIcon({className}: IconProps) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" height="24" width="24"
             className={className}>
            <path d="M3.548,20.938h16.9a.5.5,0,0,0,0-1H3.548a.5.5,0,0,0,0,1Z"></path>
            <path
                d="M9.71,17.18a2.587,2.587,0,0,0,1.12-.65l9.54-9.54a1.75,1.75,0,0,0,0-2.47l-.94-.93a1.788,1.788,0,0,0-2.47,0L7.42,13.12a2.473,2.473,0,0,0-.64,1.12L6.04,17a.737.737,0,0,0,.19.72.767.767,0,0,0,.53.22Zm.41-1.36a1.468,1.468,0,0,1-.67.39l-.97.26-1-1,.26-.97a1.521,1.521,0,0,1,.39-.67l.38-.37,1.99,1.99Zm1.09-1.08L9.22,12.75l6.73-6.73,1.99,1.99Zm8.45-8.45L18.65,7.3,16.66,5.31l1.01-1.02a.748.748,0,0,1,1.06,0l.93.94A.754.754,0,0,1,19.66,6.29Z"></path>
        </svg>
    );
}

function SearchIcon({className}: IconProps) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={className}>
            <path
                d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
    );
}

function AppHeader() {
    return (
        <header id="app-header"
                className="sticky top-0 z-10 bg-bg-light text-text-content min-h-[48px] lg:px-4 shadow-md">
            <Container className="lg:flex lg:items-stretch">
                <Flex component="h1" center className="overflow-x-auto">
                    <HeaderLink href="/">
                        <Logo className="mr-3"/>
                        <span className="tracking-wide text-lg font-bold text-text-l">{config.title}</span>
                    </HeaderLink>
                </Flex>
                <Flex grow center className="overflow-x-auto">
                    <Flex className="lg:mr-auto mr-0">
                        {config.navbar.items.map(item => (
                            <HeaderLink href={item.url} key={item.url}>{item.name}</HeaderLink>
                        ))}
                    </Flex>
                    <Flex>
                        <HeaderLink href="/editor" title="文章编辑器"><EditIcon/></HeaderLink>
                        <HeaderLink href="#" className="fill-current" ariaLabel="搜索"><SearchIcon/></HeaderLink>
                        <HeaderColorToggle/>
                    </Flex>
                </Flex>
            </Container>
        </header>
    );
}

export default AppHeader;
