import config from "@/config";
import Crypto from "crypto";

export const HEX = {
    encode(content: string) {
        return Buffer.from(content).toString("hex");
    },
    decode(content: string) {
        return Buffer.from(content, "hex").toString();
    },
};

export const HASH = {
    md5(content: string | Buffer) {
        return Crypto.createHash("md5").update(content).digest("hex");
    },
    sha256(content: string | Buffer) {
        return Crypto.createHash("sha256").update(content).digest("hex");
    },
};

export const AES = (() => {
    const algorithm = "aes-256-cbc";
    const secret = Buffer.from(config.secret.key);
    const iv = Buffer.from(config.secret.iv);
    return {
        encrypt(content: string) {
            const cipher = Crypto.createCipheriv(algorithm, secret, iv);
            let encrypted = cipher.update(content, "utf8", "hex");
            encrypted += cipher.final("hex");
            return encrypted;
        },
        decrypt(content: string) {
            const decipher = Crypto.createDecipheriv(algorithm, secret, iv);
            let decrypted = decipher.update(content, "hex", "utf8");
            decrypted += decipher.final("utf8");
            return decrypted;
        },
    };
})();
