import ImageAssetsQuickActions from "@/app/(admin)/admin/assets/images/ImageAssetsQuickActions";
import {getAllPostImagesMetadata} from "@/lib/images";
import L from "@/lib/links";
import Image from "next/image";

async function AdminAssetsImagesPage() {
    const images = await getAllPostImagesMetadata();

    return (
        <main className="mb-6 col-start-2 col-span-full space-y-6">
            <div className="bg-bg-light rounded-lg shadow p-6 space-y-4">
                <h1 className="text-lg pb-2 mb-4 font-semibold text-text-main border-b-bg-tag border-b-[1px] border-solid">
                    图片管理
                </h1>
                <ImageAssetsQuickActions/>
                <div className="flex flex-wrap gap-2 after:content-[''] after:flex-grow-[999999]">
                    {images.map((image, index) => {
                        const metadata = image.metadata;
                        const aspectRatio = `${image.metadata.width}/${image.metadata.height}`;
                        const flexGrow = (metadata.width / metadata.height * 100).toFixed(5);
                        const width = `${(200 * metadata.width / metadata.height).toFixed(5)}px`;
                        return (
                            <div key={index} className="max-w-full min-h-[40px] max-h-[400px] border-2 border-bg-tag"
                                 style={{aspectRatio, flexGrow, width}}>
                                <Image className="block h-full w-full object-cover" src={L.image.post(image.name)}
                                       alt={image.name} height={metadata.height} width={metadata.width}/>
                            </div>
                        );
                    })}
                </div>
            </div>
        </main>
    );
}

export default AdminAssetsImagesPage;
