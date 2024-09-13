import {BlockQuotePlugin} from "@/components/markdown/plugins";
import {autofixHeadingLevel, autoHeadingId, jsxConfig, removePosition} from "@/components/markdown/tools";
import config from "@/config";
import {getImageMetadata} from "@/lib/images";
import L from "@/lib/links";
import clsx from "clsx";
import fs from "fs/promises";
import Image from "next/image";
import {cache, DetailedHTMLProps, ImgHTMLAttributes} from "react";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import rehypeReact from "rehype-react";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import {unified} from "unified";
import {VFile} from "vfile";
import * as Components from "./Components";

type ImgProps = DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>;

async function _Img({className, alt, src, ...other}: ImgProps) {
    if (src && (src.startsWith("/") || src.match(/^[a-fA-F0-9]{64}\.(webp|png|jpe?g)$/))) {
        alt = alt || "";
        const metadata = await getImageMetadata(src);
        src = src.match(/^[a-fA-F0-9]{64}\.(webp|png|jpe?g)$/) ? L.image.post(src) : src;
        if (metadata) {
            return (
                <span style={{aspectRatio: `${metadata.width} / ${metadata.height}`}} className="optimize-server-image">
                    <Image className="max-w-full mx-auto"
                           sizes="(min-width: 1280px) 50vw, (min-width: 768px) 66vw, 100vw"
                        // @ts-ignore
                           src={src} alt={alt} height={metadata.height} width={metadata.width} {...other}/>
                </span>
            );
        }
        return (
            // @ts-ignore
            <Image className={clsx("mx-auto object-contain optimize-image", className)}
                // 对于透明图片效果很差, 暂时不使用
                // blurDataURL={`/_next/image?url=${encodeURIComponent(src)}&w=8&q=75`} placeholder="blur"
                   fill alt={alt} src={src} {...other}/>
        );
    } else {
        return (
            // eslint-disable-next-line @next/next/no-img-element
            <img className={clsx("mx-auto max-w-full", className)} alt={alt} src={src} {...other}/>
        );
    }
}

const SImg = _Img as unknown as (props: ImgProps) => JSX.Element;

const cacheDir = config.dir.cache;

const ServerMarkdownProcessor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(autofixHeadingLevel)
    .use(autoHeadingId)
    .use(BlockQuotePlugin)
    .use(remarkRehype, {allowDangerousHtml: true})
    .use(rehypeKatex)
    .use(rehypeHighlight)
    .use(rehypeRaw)
    .use(removePosition);

const ServerMarkdownCompiler = unified()
    // @ts-expect-error
    .use(rehypeReact, {
        ...jsxConfig, components: {
            a: Components.A,
            blockquote: Components.Blockquote,
            code: Components.Code,
            em: Components.Em,
            h1: Components.H1,
            h2: Components.H2,
            h3: Components.H3,
            h4: Components.H4,
            h5: Components.H5,
            h6: Components.H6,
            hr: Components.Hr,
            iframe: Components.IFrame,
            img: SImg,
            ol: Components.Ol,
            p: Components.P,
            pre: Components.Pre,
            strong: Components.Strong,
            table: Components.Table,
            thead: Components.THead,
            th: Components.Th,
            td: Components.Td,
            tr: Components.Tr,
            ul: Components.Ul,
            li: Components.Li,
        },
    });

interface ArticleLikeType {
    content: string;
    updatedAt: Date;
    slug: string;
}

export async function PreprocessArticleContent(article: ArticleLikeType) {
    const cacheFile = `${cacheDir}/${article.slug}-${article.updatedAt.getTime()}.json`;
    if (await fs.access(cacheFile).then(() => true).catch(() => false)) {
        try {
            return JSON.parse(await fs.readFile(cacheFile, "utf-8"));
        } catch (e) {
        }
    }
    const mdast = ServerMarkdownProcessor.parse(article.content);
    const ast = await ServerMarkdownProcessor.run(mdast, new VFile({value: article.content}));
    await fs.writeFile(cacheFile, JSON.stringify(ast));
    return ast;
}

const ServerMarkdownRender = cache(async (article: ArticleLikeType) => {
    const ast = await PreprocessArticleContent(article);
    return ServerMarkdownCompiler.stringify(ast);
});

export default ServerMarkdownRender;
