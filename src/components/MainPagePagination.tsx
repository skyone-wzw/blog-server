import Link from "next/link";
import {ReactNode} from "react";

interface MainPagePaginationProps {
    current: number;
    total: number;
}

function pagination(current: number, total: number): ReactNode {
    const result: (number | "...")[] = [];

    if (total <= 4) {
        for (let i = 1; i <= total; i++) {
            result.push(i);
        }
    } else {
        if (current === 1) {
            result.push(1, 2, "...", total);
        } else if (current === total) {
            result.push(1, "...", total - 1, total);
        } else if (total <= 5) {
            result.push(1, 2, 3, 4, 5);
        } else if (current === 2) {
            result.push(1, 2, 3, "...", total);
        } else if (current === total - 1) {
            result.push(1, "...", total - 2, total - 1, total);
        } else if (total === 6) {
            result.push(1, 2, 3, 4, 5, 6);
        } else if (current === 3) {
            result.push(1, 2, 3, 4, "...", total);
        } else if (current === total - 2) {
            result.push(1, "...", total - 3, total - 2, total - 1, total);
        } else if (total === 7) {
            result.push(1, 2, 3, 4, 5, 6, 7);
        } else if (current === 4) {
            result.push(1, 2, 3, 4, 5, "...", total);
        } else if (current === total - 3) {
            result.push(1, "...", total - 4, total - 3, total - 2, total - 1, total);
        } else {
            result.push(1, "...", current - 1, current, current + 1, "...", total);
        }
    }

    return paginationToLinks(current, result);
}

function paginationToLinks(current: number, list: (number | "...")[]): ReactNode {
    return list.map((item, index) => (
        item === "..." ? (
            <span key={`page-${index}`}>...</span>
        ) : (
            <Link
                className={`text-text-content bg-bg-light text-sm py-2 px-4 rounded-lg ${item === current ? "bg-bg-tag" : "hover:text-link-hover"}`}
                key={`page-${index}`} href={item === 1 ? "/" : `/page/${item}`}>
                {item}
            </Link>
        )
    ));
}

function MainPagePagination({current, total}: MainPagePaginationProps) {
    if (total === 1) return null;
    return (
        <div className="flex flex-row flex-nowrap justify-between items-center">
            {current === 1 ? (
                <div className="w-16"/>
            ) : (
                <Link className="text-text-content bg-bg-light text-sm p-2 rounded-lg hover:text-link-hover"
                      href={current === 2 ? `/` : `/page/${current - 1}`}>
                    上一页
                </Link>
            )}
            <span className="text-text-subnote lg:hidden">
                {current} / {total}
            </span>
            <div className="hidden lg:flex flex-row flex-nowrap items-center space-x-2">
                {pagination(current, total)}
            </div>
            {current === total ? (
                <div className="w-16"/>
            ) : (
                <Link className="text-text-content bg-bg-light text-sm p-2 rounded-lg hover:text-link-hover"
                      href={`/page/${current + 1}`}>
                    下一页
                </Link>
            )}
        </div>
    );
}

export default MainPagePagination;
