import MonacoWebpackPlugin from "monaco-editor-webpack-plugin";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import("next").NextConfig} */
const nextConfig = {
    output: "standalone",
    poweredByHeader: false,
    experimental: {
        serverActions: {
            bodySizeLimit: "20mb",
        },
    },
    webpack(config, {isServer}) {
        if (!isServer) {
            config.plugins.push(
                new MonacoWebpackPlugin({
                    languages: [
                        "json",
                        "markdown",
                        "css",
                        "typescript",
                        "javascript",
                        "html",
                        "scss",
                        "less",
                    ],
                    filename: "static/chunks/[name].worker.js",
                }),
            );
        }
        return config;
    },
};

export default withNextIntl(nextConfig);
