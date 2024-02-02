import {getAllCustomPagesMetadata} from "@/lib/custom-page";
import CustomPageSelector from "./CustomPageSelector";

async function EditorCustomPageSelector() {
    const pages = await getAllCustomPagesMetadata();

    return <CustomPageSelector pages={pages}/>;
}

export default EditorCustomPageSelector;
