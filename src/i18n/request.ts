import {getRequestConfig} from "next-intl/server";
import {getDynamicConfig} from "@/lib/config";
import {Formats} from "next-intl";

export const formats = {
    dateTime: {
        default: {
            year: "numeric",
            month: "long",
            day: "numeric",
        },
    },
} satisfies Formats;

export default getRequestConfig(async () => {
    const {site} = await getDynamicConfig();
    const locale = site.locale;

    return {
        now: new Date,
        locale,
        formats,
        messages: (await import(`../translation/common.${locale}.json`)).default,
    };
});
