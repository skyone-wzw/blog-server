import crypto from "crypto";
import {HASH_BASE64} from "@/lib/encrypt";
import {getDynamicConfig} from "@/lib/config";
import {ArticleMetadata} from "@/lib/article";
import L from "@/lib/links";
import Fediverse, {FediverseArticleItem} from "@/lib/fediverse";
import {getGuestByKeyId} from "@/lib/comment";
import {getTranslations} from "next-intl/server";

async function fetchPublicKey(keyId: string) {
    const guest = await getGuestByKeyId(keyId);
    if (guest) {
        return crypto.createPublicKey({
            key: guest.publicKey,
            format: "pem",
        });
    }
    const profile = await Fediverse.fetchActor(keyId);
    if (!profile) return null;
    return crypto.createPublicKey({
        key: profile.publicKey,
        format: "pem",
    });
}

interface FediverseKeyPair {
    publicKey: string;
    privateKey: string;
}

const FediverseUtil = {
    async generateKeyPair() {
        return new Promise<FediverseKeyPair>((resolve, reject) => {
            crypto.generateKeyPair("rsa", {
                modulusLength: 4096,
                publicKeyEncoding: {
                    type: "spki",
                    format: "pem",
                },
                privateKeyEncoding: {
                    type: "pkcs8",
                    format: "pem",
                },
            }, (err, publicKey, privateKey) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({publicKey, privateKey});
                }
            });
        });
    },

    async calculateSignature(privateKey: string, document: string, url: string) {
        const urlObject = new URL(url);
        const digest = "SHA-256=" + HASH_BASE64.sha256(document);
        const date = new Date().toUTCString();
        const keyObject = crypto.createPrivateKey({
            key: privateKey,
            format: "pem",
            type: "pkcs8",
        });
        const signed_string = `
(request-target): post ${urlObject.pathname}
host: ${urlObject.host}
date: ${date}
digest: ${digest}
        `.trim();
        const {site} = await getDynamicConfig();
        const keyId = `${site.url}${L.fediverse.about()}#main-key`;
        const signature = crypto.sign("sha256", Buffer.from(signed_string), keyObject).toString("base64");
        const header = `keyId="${keyId}",algorithm="rsa-sha256",headers="(request-target) host date digest",signature="${signature}"`;
        return {
            "Date": date,
            "Signature": header,
            "Digest": digest,
        };
    },

    async verifySignature(request: Request) {
        const signatureHeader = request.headers.get("Signature") ?? "";
        const params: Record<string, string> = {};
        signatureHeader.split(",").map((param) => param.trim()).forEach((param) => {
            const [key, value] = param.split("=");
            params[key] = value.replace(/^"|"$/g, "");
        });
        const keyId = params["keyId"],
            headersString = params["headers"],
            signatureString = params["signature"];
        if (!keyId || !headersString || !signatureString) return false;
        const publicKey = await fetchPublicKey(keyId);
        if (!publicKey) return false;
        const headerMap: Record<string, string> = {
            "(request-target)": `(request-target): ${request.method.toLowerCase()} ${new URL(request.url).pathname}`,
            "host": `host: ${request.headers.get("Host")}`,
            "date": `date: ${request.headers.get("Date")}`,
            "digest": `digest: ${request.headers.get("Digest")}`,
            "content-type": `content-type: ${request.headers.get("Content-Type")}`,
        };
        const headerRest = (header: string) => `${header}: ${request.headers.get(header)}`;
        const signingString = headersString.split(" ").map((header) => headerMap[header] ?? headerRest(header)).join("\n");
        try {
            return crypto.verify("sha256", Buffer.from(signingString, "utf-8"), publicKey, Buffer.from(signatureString, "base64"));
        } catch (e) {
            return false;
        }
    },

    async articleToFediverseNode(article: ArticleMetadata): Promise<FediverseArticleItem> {
        const t = await getTranslations("keyword");
        const {site} = await getDynamicConfig();
        const series = `<a href="${site.url}${L.series(article.series)}" title="${article.series}">${article.series}</a>`;
        const seriesMd = `[${article.series}](${site.url}${L.series(article.series)})`;
        const tags = article.tags.map((tag) =>
            `<a style="text-decoration: underline" href="${site.url}${L.tags(tag)}" title="${tag}">#${tag}</a>`).join(", ");
        const tagsMd = article.tags.map((tag) =>
            `[#${tag}](${site.url}${L.tags(tag)})`).join(", ");
        return {
            id: `${site.url}${L.post(article.slug)}`,
            type: "Note",
            attributedTo: `${site.url}${L.fediverse.about()}`,
            inReplyTo: null,
            content: `<p>${article.title}</p><p>${article.description}</p>`
                + `<p>${t("series")}: ${series}</p>`
                + (tags.length > 0 ? `<p>${t("tags")}: ${tags}</p>` : "")
                + `<p><a href="${site.url}${L.post(article.slug)}">${t("readMore")}</a></p>`,
            published: article.createdAt.toISOString(),
            to: [
                "https://www.w3.org/ns/activitystreams#Public",
            ],
            source: {
                mediaType: "text/markdown",
                content: `${article.title}\n\n${article.description}`
                    + `\n\n${t("series")}: ${seriesMd}`
                    + (tags.length > 0 ? `\n\n${t("tags")}: ${tagsMd}` : "")
                    + `[${t("readMore")}](${site.url}${L.post(article.slug)})`,
            },
        };
    },
};

export default FediverseUtil;
