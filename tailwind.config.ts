import type {Config} from "tailwindcss";
import containerQueries from "@tailwindcss/container-queries";
import Color from "tailwindcss/colors";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            screens: {
                "3xl": "1920px",
            },
            colors: {
                bg: {
                    dark: "var(--bg-d)",
                    light: "var(--bg-l)",
                    hover: "var(--bg-hover)",
                    tag: "var(--bg-tag)",
                    quote: "var(--bg-quote)",
                },
                button: {
                    bg: "var(--button)",
                    hover: "var(--button-hover)",
                    text: Color.white,
                },
                text: {
                    main: "var(--text-main)",
                    content: "var(--text-content)",
                    subnote: "var(--text-subnote)",
                },
                link: {
                    content: "var(--text-link)",
                    hover: "var(--text-link-hover)",
                },
                border: "var(--border)",
            },
        },
    },
    plugins: [
        containerQueries
    ],
};
export default config;
