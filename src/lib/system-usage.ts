import config from "@/config";
import fs from "fs/promises";
import os from "node:os";

const DATABASE_URL = process.env.DATABASE_URL;
const cacheDir = config.dir.cache;

export function humanReadableSize(bytes: number, si = false, dp = 1) {
    const thresh = si ? 1000 : 1024;
    if (Math.abs(bytes) < thresh) {
        return bytes + " B";
    }
    const units = si
        ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
        : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
    let u = -1;
    const r = 10 ** dp;
    do {
        bytes /= thresh;
        ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);
    return bytes.toFixed(dp) + " " + units[u];
}

export async function getDatabaseSize() {
    if (!DATABASE_URL) return -1;
    const path = DATABASE_URL.replace(/^file:/, "");
    try {
        const stat = await fs.stat(path);
        return stat.size;
    } catch (e) {
        return -1;
    }
}

export async function getMemoryUsage() {
    return process.memoryUsage();
}

export async function getSystemUsage() {
    const total = os.totalmem()
    const free = os.freemem()
    const usage = total - free;
    return {
        total,
        free,
        usage,
        percentage: (usage / total) * 100,
    };
}

export async function getCacheSize() {
    const files = await fs.readdir(cacheDir);
    const cacheFiles = files.filter((file) => file.endsWith(".json") || file.endsWith(".png"));
    let size = 0;
    for (const file of cacheFiles) {
        const stat = await fs.stat(`${cacheDir}/${file}`);
        size += stat.size;
    }
    return size;
}
