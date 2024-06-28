"use client";

import {useColorMode} from "@/components/ColorModeProvider";
import clsx from "clsx";
import {MouseEventHandler} from "react";
import {flushSync} from "react-dom";

interface IconProps {
    className?: string;
}

function LightModeIcon({className}: IconProps) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={className}>
            <path
                d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a.996.996 0 0 0 0-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/>
        </svg>
    );
}

function DarkModeIcon({className}: IconProps) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={className}>
            <path
                d="M11.01 3.05C6.51 3.54 3 7.36 3 12a9 9 0 0 0 9 9c4.63 0 8.45-3.5 8.95-8 .09-.79-.78-1.42-1.54-.95A5.403 5.403 0 0 1 11.1 7.5c0-1.06.31-2.06.84-2.89.45-.67-.04-1.63-.93-1.56z"/>
        </svg>
    );
}

function SystemModeIcon({className}: IconProps) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={className}>
            <path
                d="M10.85 12.65h2.3L12 9l-1.15 3.65zM20 8.69V6c0-1.1-.9-2-2-2h-2.69l-1.9-1.9c-.78-.78-2.05-.78-2.83 0L8.69 4H6c-1.1 0-2 .9-2 2v2.69l-1.9 1.9c-.78.78-.78 2.05 0 2.83l1.9 1.9V18c0 1.1.9 2 2 2h2.69l1.9 1.9c.78.78 2.05.78 2.83 0l1.9-1.9H18c1.1 0 2-.9 2-2v-2.69l1.9-1.9c.78-.78.78-2.05 0-2.83L20 8.69zm-5.91 6.71L13.6 14h-3.2l-.49 1.4c-.13.36-.46.6-.84.6a.888.888 0 0 1-.84-1.19l2.44-6.86c.2-.57.73-.95 1.33-.95.6 0 1.13.38 1.34.94l2.44 6.86a.888.888 0 0 1-.84 1.19.874.874 0 0 1-.85-.59z"/>
        </svg>
    );
}

type ColorMode = "light" | "dark" | "system";

function getColorModeIron(mode: ColorMode) {
    if (mode === "light") {
        return <LightModeIcon/>;
    } else if (mode === "dark") {
        return <DarkModeIcon/>;
    } else {
        return <SystemModeIcon/>;
    }
}

function HeaderColorToggle() {
    const {colorMode, toggleColorMode} = useColorMode();

    const listener: MouseEventHandler = async (e) => {
        if (!document.startViewTransition) {
            toggleColorMode();
            return;
        }
        const x = e.clientX;
        const y = e.clientY;
        const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

        const vt = document.startViewTransition(() => {
            flushSync(() => {
                toggleColorMode();
            });
        });
        await vt.ready;
        const duration = 200;
        if (colorMode === "light") {
            const frameConfig = {
                clipPath: [
                    `circle(0 at ${x}px ${y}px)`,
                    `circle(${radius}px at ${x}px ${y}px)`,
                ],
            };
            const timingConfig = {
                duration: duration,
                pseudoElement: "::view-transition-new(root)",
            };
            document.documentElement.animate(frameConfig, timingConfig);
        } else {
            const frameConfig = {
                clipPath: [
                    `circle(${radius}px at ${x}px ${y}px)`,
                    `circle(0 at ${x}px ${y}px)`,
                ],
                zIndex: [10, 10],
            };
            const timingConfig = {
                duration: duration,
                pseudoElement: "::view-transition-old(root)",
            };
            document.documentElement.animate(frameConfig, timingConfig);
        }
    };

    return (
        <button onClick={listener} aria-label="切换颜色模式" title="切换颜色模式" type="button"
                className={clsx("p-3 shrink-0 flex cursor-pointer items-center hover:bg-bg-hover hover:text-link-hover fill-current")}>
            {getColorModeIron(colorMode)}
        </button>
    );
}

export default HeaderColorToggle;
