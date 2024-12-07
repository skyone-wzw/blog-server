import zhHans from "@/translation/common.zh-hans.json";
import {formats} from "@/i18n/request";

type Messages = typeof zhHans;
type Formats = typeof formats;

declare global {
    interface IntlMessages extends Messages {}

    interface IntlFormats extends Formats {}
}
