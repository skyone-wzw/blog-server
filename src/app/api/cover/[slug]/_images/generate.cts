import fs from "fs/promises";

async function generate() {
    const files = await fs.readdir(__dirname);
    const images = files.filter(file => file.endsWith(".png"));
    const imports = images.map(image => {
        const name = image.replace(/\.png$/, "").replace(/^(\d)/, "C$1");
        return `import ${name} from "./${image}";`;
    }).join("\n");
    const objects = `const images = [\n    ${images.map(image => {
        return image.replace(/\.png$/, "").replace(/^(\d)/, "C$1");
    }).join(",\n    ").trim()}\n];`;
    const exports = "export default images;";
    await fs.writeFile(__dirname + "/index.ts", `${imports}\n\n${objects}\n\n${exports}\n`);
}

generate();
