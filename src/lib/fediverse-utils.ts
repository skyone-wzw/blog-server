import crypto from "crypto";
import {HASH} from "@/lib/encrypt";
import {getDynamicConfig} from "@/lib/config";
import {ArticleMetadata} from "@/lib/article";
import L from "@/lib/links";
import {FediverseArticleItem} from "@/lib/fediverse";
import {getGuestByKeyId} from "@/lib/comment";

async function fetchPublicKey(keyId: string) {
    const guest = await getGuestByKeyId(keyId);
    if (guest) {
        return crypto.createPublicKey({
            key: guest.publicKey,
            format: "pem",
        });
    }
    let publicKey;
    const response = await fetch(keyId, {
        method: "GET",
        headers: {
            "Accept": "application/activity+json",
        },
    });
    if (!response.ok) return;
    const profile = await response.json();
    if (typeof profile.publicKey === "string") {
        publicKey = profile.publicKey;
    } else if (profile.publicKey instanceof Array) {
        for (const key of profile.publicKey) {
            if (typeof key === "object" && key.id === keyId) {
                publicKey = key.publicKeyPem;
                break;
            } else if (typeof key === "string") {
                publicKey = key;
                break;
            }
        }
    } else if (typeof profile.publicKey === "object") {
        publicKey = profile.publicKey.publicKeyPem;
    }
    if (!publicKey) return;
    return crypto.createPublicKey({
        key: publicKey,
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
        const digest = "SHA-256=" + HASH.sha256(document);
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
        const keyId = `${site.url}/api/fediverse/me#main-key`;
        const signature = crypto.sign("sha256", Buffer.from(signed_string), keyObject).toString("base64");
        const header = `keyId="${keyId}",headers="(request-target) host date digest",signature="${signature}"`;
        return {
            "Date": date,
            "Signature": header,
            "Digest": `SHA-256=${digest}`,
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
        };
        const signingString = headersString.split(" ").map((header) => headerMap[header] ?? "").join("\n");
        try {
            return crypto.verify("sha256", Buffer.from(signingString, "utf-8"), publicKey, Buffer.from(signatureString, "base64"));
        } catch (e) {
            return false;
        }
    },

    async articleToFediverseNode(article: ArticleMetadata): Promise<FediverseArticleItem> {
        const {site} = await getDynamicConfig();
        return {
            id: `${site.url}${L.post(article.slug)}`,
            type: "Note",
            attributedTo: `${site.url}${L.fediverse.about()}`,
            inReplyTo: null,
            content: `<p>${article.title}</p><p>${article.description}</p><p><a href="${site.url}${L.post(article.slug)}">Read more</a></p>`,
            published: article.createdAt.toISOString(),
            to: [
                "https://www.w3.org/ns/activitystreams#Public",
            ],
            source: {
                mediaType: "text/markdown",
                content: `${article.title}\n\n${article.description}\n\n[Read more](${site.url}${L.post(article.slug)})`,
            },
        };
    },
};

export default FediverseUtil;
