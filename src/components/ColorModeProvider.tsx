"use client";

import {createContext, ReactNode, useCallback, useContext, useEffect, useState} from "react";

export type ColorMode = "light" | "dark" | "system";
export type CurrentColorMode = "light" | "dark";
export type SystemColorMode = "light" | "dark";

type ColorModeContext = {
    colorMode: ColorMode;
    currentColorMode: CurrentColorMode;
    systemColorMode: SystemColorMode;
    setColorMode: (colorMode: ColorMode) => void;
    toggleColorMode: () => void;
}

const ColorModeContext = createContext<ColorModeContext>(null!);

interface ColorModeProviderProps {
    children: ReactNode;
}

function ColorModeProvider({children}: ColorModeProviderProps) {
    const [colorMode, _setColorMode] = useState<ColorMode>("light");
    const [currentColorMode, setCurrentColorMode] = useState<CurrentColorMode>("light");
    const [systemColorMode, setSystemColorMode] = useState<SystemColorMode>("light");

    const setColorMode: typeof _setColorMode = (_colorMode) => {
        _setColorMode((prevColorMode) => {
            const colorMode = _colorMode instanceof Function ? _colorMode(prevColorMode) : _colorMode;
            localStorage.setItem("pattern.mode", colorMode);
            window.dispatchEvent(new CustomEvent("color-mode-change", {
                detail: colorMode,
            }));
            if (colorMode === "light") {
                document.documentElement.classList.add("light");
                document.documentElement.classList.remove("dark");
            } else if (colorMode === "dark") {
                document.documentElement.classList.add("dark");
                document.documentElement.classList.remove("light");
            } else {
                document.documentElement.classList.remove("light");
                document.documentElement.classList.remove("dark");
            }
            return colorMode;
        });
    };

    useEffect(() => {
        // Initialize color mode from local storage
        const colorMode = localStorage.getItem("pattern.mode");
        if (colorMode === "system" || colorMode === "dark") {
            setColorMode(colorMode);
        } else {
            setColorMode("light");
        }

        // Listen for color mode change events
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        if (mediaQuery.matches) {
            setSystemColorMode("dark");
        } else {
            setSystemColorMode("light");
        }
        const listener = (e: MediaQueryListEvent) => {
            if (e.matches) {
                setSystemColorMode("dark");
            } else {
                setSystemColorMode("light");
            }
        };
        mediaQuery.addEventListener("change", listener);
        return () => {
            mediaQuery.removeEventListener("change", listener);
        };
    }, []);

    useEffect(() => {
        if (colorMode === "system") {
            setCurrentColorMode(systemColorMode);
        } else {
            setCurrentColorMode(colorMode);
        }
    }, [colorMode, systemColorMode]);

    const toggleColorMode = () => {
        setColorMode(prev => {
            if (prev === "light") {
                return "dark";
            } else if (prev === "dark") {
                return "system";
            } else {
                return "light";
            }
        })
    };

    const memoizedSetColorMode = useCallback(setColorMode, []);
    const memoizedToggleColorMode = useCallback(toggleColorMode, []);

    const value = {
        colorMode,
        currentColorMode,
        systemColorMode,
        setColorMode: memoizedSetColorMode,
        toggleColorMode: memoizedToggleColorMode,
    }

    return (
        <ColorModeContext.Provider value={value}>
            {children}
        </ColorModeContext.Provider>
    );
}

export default ColorModeProvider;

export function useColorMode() {
    return useContext(ColorModeContext);
}
