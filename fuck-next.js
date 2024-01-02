const fs = require("fs");
const path = require("path");

const source = path.resolve(__dirname, "NotoSansSC-Regular.ttf")
const target = path.resolve(__dirname, "node_modules/next/dist/compiled/@vercel/og/noto-sans-v27-latin-regular.ttf");

fs.rmSync(target);
fs.cpSync(source, target)
