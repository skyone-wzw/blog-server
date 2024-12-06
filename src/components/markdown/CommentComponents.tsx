import {
    AnchorHTMLAttributes,
    BlockquoteHTMLAttributes,
    DetailedHTMLProps,
    HTMLAttributes,
    ImgHTMLAttributes,
    ThHTMLAttributes,
} from "react";
import clsx from "clsx";
import Link from "next/link";

type AProps = DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;

function A({href, children, className}: AProps) {
    href = href || "#";

    return (
        <Link href={href}
              className={clsx("text-link-content hover:text-link-hover", className)}
              target="_blank" rel={"noopener noreferrer"}>{children}</Link>
    );
}

type BlockquoteProps = DetailedHTMLProps<BlockquoteHTMLAttributes<HTMLQuoteElement>, HTMLQuoteElement>;

function Blockquote({children, className}: BlockquoteProps) {
    return (
        <blockquote
            className={clsx("border-l-4 border-l-border bg-bg-quote px-4 py-3 mb-4 rounded quote-alert", className)}>
            {children}
        </blockquote>
    );

}

type CodeProps = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;

function Code({children, className}: CodeProps) {
    return (
        <code
            className={clsx("bg-bg-tag px-1.5 py-0.5 rounded xc-scroll", className)}>
            {children}
        </code>
    );
}

type EmProps = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;

function Em({children, className}: EmProps) {
    return (
        <em className={clsx("italic", className)}>{children}</em>
    );
}

type HProps = DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;

function H1({children, className}: HProps) {
    return (
        <p className={clsx("text-3xl pb-2 mb-4 font-semibold text-text-main border-b-bg-tag border-b-[1px] border-solid", className)}>
            {children}
        </p>
    );
}

function H2({children, className}: HProps) {
    return (
        <p className={clsx("text-2xl pb-2 mb-4 font-semibold text-text-main border-b-bg-tag border-b-[1px] border-solid", className)}>
            {children}
        </p>
    );
}

function H3({children, className}: HProps) {
    return (
        <p className={clsx("text-xl mb-4 font-semibold text-text-main", className)}>{children}</p>
    );
}

function H4({children, className}: HProps) {
    return (
        <p className={clsx("text-lg mb-4 font-semibold text-text-main", className)}>{children}</p>
    );
}

function H5({children, className}: HProps) {
    return (
        <p className={clsx("text-base mb-4 font-semibold text-text-main", className)}>{children}</p>
    );
}

function H6({children, className}: HProps) {
    return (
        <p className={clsx("text-base mb-4 text-text-content", className)}>{children}</p>
    );
}

type HrProps = DetailedHTMLProps<HTMLAttributes<HTMLHRElement>, HTMLHRElement>;

function Hr({className}: HrProps) {
    return (
        <hr className={clsx("border-solid border-y-2 border-y-bg-tag my-6", className)}/>
    );
}

type ImgProps = DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>;

function Img({className, alt, src, height, width}: ImgProps) {
    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img className={clsx("mx-auto max-w-full", className)} alt={alt} src={src} height={height} width={width}/>
    );
}

type OlProps = DetailedHTMLProps<HTMLAttributes<HTMLOListElement>, HTMLOListElement>;

function Ol({children, className}: OlProps) {
    return (
        <ol className={clsx("mb-4 pl-8 list-decimal text-text-content", className)}>{children}</ol>
    );
}

type PProps = DetailedHTMLProps<HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>;

function P({children, className}: PProps) {
    return (
        <p className={clsx("mb-4 last:mb-0 text-text-content", className)}>{children}</p>
    );
}

type PreProps = DetailedHTMLProps<HTMLAttributes<HTMLPreElement>, HTMLPreElement>;

function Pre({children, className}: PreProps) {
    return (
        <pre className={clsx("text-sm mb-4 overflow-auto text-text-content", className)}>{children}</pre>
    );
}

type StrongProps = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;

function Strong({children, className}: StrongProps) {
    return (
        <strong className={clsx("font-semibold text-text-content", className)}>{children}</strong>
    );
}

type TableProps = DetailedHTMLProps<HTMLAttributes<HTMLTableElement>, HTMLTableElement>;

function Table({children, className}: TableProps) {
    return (
        <table
            className={clsx("mb-4 border w-[max-content] border-bg-tag overflow-auto xc-scroll max-w-full text-text-content", className)}>{children}</table>
    );
}

type THeadProps = DetailedHTMLProps<HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>;

function THead({children, className}: THeadProps) {
    return (
        <thead className={clsx("text-text-content border-b font-medium", className)}>{children}</thead>
    );
}

type ThProps = DetailedHTMLProps<ThHTMLAttributes<HTMLTableCellElement>, HTMLTableCellElement>;

function Th({children, className}: ThProps) {
    return (
        <th className={clsx("px-2 py-1 border-r border-bg-tag last:border-r-0", className)}>{children}</th>
    );
}

type TdProps = DetailedHTMLProps<ThHTMLAttributes<HTMLTableCellElement>, HTMLTableCellElement>;

function Td({children, className}: TdProps) {
    return (
        <td className={clsx("px-2 py-1 border-r border-bg-tag last:border-r-0", className)}>{children}</td>
    );
}

type TrProps = DetailedHTMLProps<HTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement>;

function Tr({children, className}: TrProps) {
    return (
        <tr className={clsx("border-b border-bg-tag last:border-b-0", className)}>{children}</tr>
    );
}

type UlProps = DetailedHTMLProps<HTMLAttributes<HTMLUListElement>, HTMLUListElement>;

function Ul({children, className}: UlProps) {
    return (
        <ul className={clsx("mb-4 pl-8 list-disc text-text-content", className)}>{children}</ul>
    );
}

type LiProps = DetailedHTMLProps<HTMLAttributes<HTMLLIElement>, HTMLLIElement>;

function Li({children, className}: LiProps) {
    return (
        <li className={clsx("text-text-content", className)}>{children}</li>
    );
}

function Noop() {
    return <></>;
}


export {
    A,
    Blockquote,
    Code,
    Em,
    H1,
    H2,
    H3,
    H4,
    H5,
    H6,
    Noop,
    Hr,
    Img,
    Li,
    Ol,
    P,
    Pre,
    Strong,
    Table,
    Td,
    Th,
    THead,
    Tr,
    Ul,
};
