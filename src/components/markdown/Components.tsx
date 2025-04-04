import clsx from "clsx";
import Link from "next/link";
import {
    AnchorHTMLAttributes,
    BlockquoteHTMLAttributes,
    DetailedHTMLProps,
    HTMLAttributes,
    IframeHTMLAttributes,
    ImgHTMLAttributes,
    ThHTMLAttributes,
} from "react";
import {ImageWithViewer, ImgWithViewer} from "@/components/tools/ImageWithViewer";

type AProps = DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;

function A({href, children, className, ...other}: AProps) {
    href = href || "#";
    const isExternal = href.startsWith("http") || href.startsWith("//");

    return (
        // @ts-ignore
        <Link href={href}
              className={clsx("text-link-content hover:text-link-hover", className)}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
              {...other}>{children}</Link>
    );
}

function AInNavBar({children, className}: AProps) {
    return (
        <span className={clsx("text-link-content hover:text-link-hover", className)}>{children}</span>
    );
}

type BlockquoteProps = DetailedHTMLProps<BlockquoteHTMLAttributes<HTMLQuoteElement>, HTMLQuoteElement>;

function Blockquote({children, className, ...other}: BlockquoteProps) {
    return (
        <blockquote
            className={clsx("border-l-4 border-l-border bg-bg-quote px-4 py-3 mb-4 rounded-sm quote-alert", className)}
            {...other}>{children}</blockquote>
    );

}

type CodeProps = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;

function Code({children, className, ...other}: CodeProps) {
    return (
        <code
            className={clsx("bg-bg-tag px-1.5 py-0.5 rounded-sm xc-scroll", className)} {...other}>{children}</code>
    );
}

type EmProps = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;

function Em({children, className, ...other}: EmProps) {
    return (
        <em className={clsx("italic", className)} {...other}>{children}</em>
    );
}

type HProps = DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;

function H1({children, className, ...other}: HProps) {
    return (
        <h1 className={clsx("text-3xl pb-2 mb-4 font-semibold text-text-main border-b-bg-tag border-b-[1px] border-solid", className)}
            {...other}>{children}</h1>
    );
}

function H2({children, className, ...other}: HProps) {
    return (
        <h2 className={clsx("text-2xl pb-2 mb-4 font-semibold text-text-main border-b-bg-tag border-b-[1px] border-solid", className)}
            {...other}>{children}</h2>
    );
}

function H3({children, className, ...other}: HProps) {
    return (
        <h3 className={clsx("text-xl mb-4 font-semibold text-text-main", className)}
            {...other}>{children}</h3>
    );
}

function H4({children, className, ...other}: HProps) {
    return (
        <h4 className={clsx("text-lg mb-4 font-semibold text-text-main", className)}
            {...other}>{children}</h4>
    );
}

function H5({children, className, ...other}: HProps) {
    return (
        <h5 className={clsx("text-base mb-4 font-semibold text-text-main", className)}
            {...other}>{children}</h5>
    );
}

function H6({children, className, ...other}: HProps) {
    return (
        <h6 className={clsx("text-base mb-4 text-text-content", className)}
            {...other}>{children}</h6>
    );
}

type HrProps = DetailedHTMLProps<HTMLAttributes<HTMLHRElement>, HTMLHRElement>;

function Hr({className, ...other}: HrProps) {
    return (
        <hr className={clsx("border-solid border-y-2 border-y-bg-tag my-6", className)} {...other} />
    );
}

type IFrameProps = DetailedHTMLProps<IframeHTMLAttributes<HTMLIFrameElement>, HTMLIFrameElement>;

function IFrame({className, height, ...other}: IFrameProps) {
    height = height || "100px";
    return (
        <iframe className={clsx("w-full mb-4", className)} height={height} {...other} />
    );
}

type ImgProps = DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>;

function Img({className, alt, src, height, width, ...other}: ImgProps) {
    if (typeof height === "number" && typeof width === "number") {
        return (
            <span style={{aspectRatio: `${width} / ${height}`}} className="optimize-server-image">
                    <ImageWithViewer className="max-w-full mx-auto"
                           sizes="(min-width: 1280px) 50vw, (min-width: 768px) 66vw, 100vw"
                        // @ts-ignore
                           src={src} alt={alt} height={height} width={width} {...other}/>
                </span>
        );
    }
    if (src && src.startsWith("/")) {
        alt = alt || "image";
        return (
            // @ts-ignore
            <ImageWithViewer className={clsx("mx-auto optimize-image", className)}
                   style={{objectFit: "contain"}}
                   sizes="(min-width: 1280px) 50vw, (min-width: 768px) 66vw, 100vw"
                // 对于透明图片效果很差, 暂时不使用
                // blurDataURL={`/_next/image?url=${encodeURIComponent(src)}&w=8&q=75`} placeholder="blur"
                   fill alt={alt} src={src} {...other}/>
        );
    } else {
        return (
            // eslint-disable-next-line @next/next/no-img-element
            <ImgWithViewer className={clsx("mx-auto max-w-full", className)} alt={alt} src={src} {...other}/>
        );
    }
}

type OlProps = DetailedHTMLProps<HTMLAttributes<HTMLOListElement>, HTMLOListElement>;

function Ol({children, className, ...other}: OlProps) {
    return (
        <ol className={clsx("mb-4 pl-8 list-decimal text-text-content", className)} {...other}>{children}</ol>
    );
}

type PProps = DetailedHTMLProps<HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>;

function P({children, className, ...other}: PProps) {
    return (
        <p className={clsx("mb-4 last:mb-0 text-text-content", className)} {...other}>{children}</p>
    );
}

type PreProps = DetailedHTMLProps<HTMLAttributes<HTMLPreElement>, HTMLPreElement>;

function Pre({children, className, ...other}: PreProps) {
    return (
        <pre className={clsx("text-sm mb-4 overflow-auto text-text-content", className)} {...other}>{children}</pre>
    );
}

type StrongProps = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;

function Strong({children, className, ...other}: StrongProps) {
    return (
        <strong className={clsx("font-semibold text-text-content", className)} {...other}>{children}</strong>
    );
}

type TableProps = DetailedHTMLProps<HTMLAttributes<HTMLTableElement>, HTMLTableElement>;

function Table({children, className, ...other}: TableProps) {
    return (
        <table
            className={clsx("mb-4 border w-[max-content] border-bg-tag overflow-auto xc-scroll max-w-full text-text-content", className)} {...other}>{children}</table>
    );
}

type THeadProps = DetailedHTMLProps<HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>;

function THead({children, className, ...other}: THeadProps) {
    return (
        <thead className={clsx("text-text-content border-b font-medium", className)} {...other}>{children}</thead>
    );
}

type ThProps = DetailedHTMLProps<ThHTMLAttributes<HTMLTableCellElement>, HTMLTableCellElement>;

function Th({children, className, ...other}: ThProps) {
    return (
        <th className={clsx("px-2 py-1 border-r border-bg-tag last:border-r-0", className)} {...other}>{children}</th>
    );
}

type TdProps = DetailedHTMLProps<ThHTMLAttributes<HTMLTableCellElement>, HTMLTableCellElement>;

function Td({children, className, ...other}: TdProps) {
    return (
        <td className={clsx("px-2 py-1 border-r border-bg-tag last:border-r-0", className)} {...other}>{children}</td>
    );
}

type TrProps = DetailedHTMLProps<HTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement>;

function Tr({children, className, ...other}: TrProps) {
    return (
        <tr className={clsx("border-b border-bg-tag last:border-b-0", className)} {...other}>{children}</tr>
    );
}

type UlProps = DetailedHTMLProps<HTMLAttributes<HTMLUListElement>, HTMLUListElement>;

function Ul({children, className, ...other}: UlProps) {
    return (
        <ul className={clsx("mb-4 pl-8 list-disc text-text-content", className)} {...other}>{children}</ul>
    );
}

type LiProps = DetailedHTMLProps<HTMLAttributes<HTMLLIElement>, HTMLLIElement>;

function Li({children, className, ...other}: LiProps) {
    return (
        <li className={clsx("text-text-content", className)} {...other}>{children}</li>
    );
}

export {
    A,
    AInNavBar,
    Blockquote,
    Code,
    Em,
    H1,
    H2,
    H3,
    H4,
    H5,
    H6,
    Hr,
    IFrame,
    Img,
    Ol,
    P,
    Pre,
    Strong,
    Table,
    THead,
    Th,
    Td,
    Tr,
    Ul,
    Li,
};
