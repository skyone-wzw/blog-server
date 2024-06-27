import MonacoWebpackPlugin from "monaco-editor-webpack-plugin";

/** @type {import("next").NextConfig} */
const nextConfig = {
    poweredByHeader: false,
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
                })
            );
        }
        return config;
    }
};

export default nextConfig;
