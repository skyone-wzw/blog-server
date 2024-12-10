import Link from "next/link";
import {ReactNode} from "react";
import {getTranslations} from "next-intl/server";

type Page2Link = (page: number) => string;

interface MainPagePaginationProps {
    current: number;
    total: number;
    getLink: Page2Link;
}

export function paginationElements(current: number, total: number, around: number): number[] {
    // 左右两侧分别 2 个, 中间 1 个, 中间周围 around 个
    const boundary = 2 * 2 + 2 * around + 1;
    if (total <= boundary) {
        return Array.from({length: total}, (_, index) => index + 1);
    }
    // 生成 boundary 个元素, 最中间的为 current
    let result = Array.from({length: boundary}, (_, index) => index + current - 2 - around);
    // 如果左右在边界内 (1, total) 开区间, 使用省略号, 这里使用 NaN 占位
    if (result[0] > 1) {
        result[1] = NaN;
    }
    if (result[result.length - 1] < total) {
        result[result.length - 2] = NaN;
    }
    // 过滤掉不在 [1, total] 闭区间的元素
    result = result.filter((item) => isNaN(item) || (item >= 1 && item <= total));
    // 设置首尾元素
    result[0] = 1;
    result[result.length - 1] = total;
    return result;
}

export function pagination(current: number, total: number, getLink: Page2Link): ReactNode {
    const list = paginationElements(current, total, 3);
    return list.map((item, index) => (
        isNaN(item) ? (
            <span key={`page-${index}`}>...</span>
        ) : (
            <Link
                className={`text-text-content bg-bg-light text-sm py-2 px-4 rounded-lg ${item === current ? "bg-bg-tag" : "hover:text-link-hover"}`}
                key={`page-${index}`} href={getLink(item)}>
                {item}
            </Link>
        )
    ));
}

async function FooterPagination({current, total, getLink}: MainPagePaginationProps) {
    const t = await getTranslations("FooterPagination");
    if (total <= 1) return null;

    return (
        <div className="flex flex-row flex-nowrap justify-between items-center">
            {current === 1 ? (
                <div className="w-16"/>
            ) : (
                <Link className="text-text-content bg-bg-light text-sm p-2 rounded-lg hover:text-link-hover"
                      href={current === 2 ? getLink(1) : getLink(current - 1)}>
                    {t("prev")}
                </Link>
            )}
            <span className="text-text-subnote lg:hidden">
                {current} / {total}
            </span>
            <div className="hidden lg:flex flex-row flex-nowrap items-center space-x-2">
                {pagination(current, total, getLink)}
            </div>
            {current === total ? (
                <div className="w-16"/>
            ) : (
                <Link className="text-text-content bg-bg-light text-sm p-2 rounded-lg hover:text-link-hover"
                      href={getLink(current + 1)}>
                    {t("next")}
                </Link>
            )}
        </div>
    );
}

export default FooterPagination;
