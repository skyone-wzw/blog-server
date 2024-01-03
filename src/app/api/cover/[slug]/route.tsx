import config from "@/config";
import {getArticleMetadataBySlug} from "@/lib/article";
import {ImageResponse} from "next/og";
import images from "./_images";

function formatDate(date: Date) {
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
}

const bg = images.map((image) => `http://127.0.0.1:3000${image.src}`);

export const revalidate = false;

interface ArticleCoverProps {
    params: {
        slug: string;
    };
}

export async function GET(_: Request, {params}: ArticleCoverProps) {
    const {slug} = params;
    const article = await getArticleMetadataBySlug(slug);
    if (!article) {
        return new Response("Not Found", {status: 404});
    }
    return new ImageResponse(
        <div style={{
            display: "flex",
            width: 1300,
            height: 630,
            background: "#ffffff",
        }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={bg[Math.floor(Math.random() * bg.length)]}
                 alt="cover"
                 height={630}
                 width={1300}
                 style={{
                     position: "absolute",
                     top: 0,
                     left: 0,
                     width: 1300,
                     height: 630,
                     objectFit: "cover",
                 }}/>
            <div style={{
                display: "flex",
                position: "absolute",
                top: 115,
                left: 170,
                width: 960,
                height: 400,
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                background: "#ffffffDD",
                overflow: "hidden",
                borderRadius: 12,
            }}>
                <div style={{
                    maxWidth: 860,
                    fontSize: 36,
                    color: "#475c6e",
                    height: 108,
                    overflow: "hidden",
                }}>{article.title}</div>
                <div style={{display: "flex", width: 860, flexDirection: "row", padding: 20, overflow: "hidden"}}>
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "nowrap",
                        justifyContent: "flex-start",
                        alignItems: "flex-end",
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="36" width="36" viewBox="0 0 512 512"
                             style={{borderRadius: "100%", background: "#FFFFFF"}}>
                            <path fill="#6cf" d="M0,170.61Q170.7,341.295,341.42,512H0Z"/>
                            <path fill="#6cf" d="M170.54,0H512V341.42Q341.21,170.765,170.54,0Z"/>
                            <g id="wings">
                                <path fill="#058"
                                      d="M389.14,397.15c3.851,2,8.108,4.017,12.763,5.941,4.968,2.055,9.692,3.717,14.077,5.071q-.561,2.921-1.108,5.881-.557,3.016-1.085,6A106,106,0,0,1,382.6,408.81C384.49,404.77,386.94,401.02,389.14,397.15Z"/>
                                <path fill="#058"
                                      d="M243.77,340.39c28.42-.88,56.85-1.26,85.28-1.74a155.327,155.327,0,0,0,17.75,24.36c-19.73,6.71-40,11.69-59.89,17.92-2.87.83-5.73,1.88-8.74,2.05-3.49-2.5-5.92-6.17-8.96-9.16C260.07,363.22,251.04,352.37,243.77,340.39Z"/>
                                <path fill="#058"
                                      d="M319.84,388.84c11.29-6.11,22.51-12.38,34.04-18.05a87.124,87.124,0,0,0,19.59,15.15c-9.47,11.15-18.66,22.52-27.83,33.91-5.23-1.35-9.69-4.49-14.21-7.3a119.748,119.748,0,0,1-22.05-17.7C312.63,392.45,316.3,390.75,319.84,388.84Z"/>
                                <path fill="#6cf"
                                      d="M142.524,36.383S223.319,150.468,294.47,211.71c.24,9.82.531,17.079,1.52,29.44-26.618-14.831-53.033-31.746-67.469-40.873s-95.719-70.872-95.989-71.192c.473-14.926,1.523-30.946,3.389-47.9C137.675,65.249,139.95,50.287,142.524,36.383Z"/>
                                <path fill="#6cf"
                                      d="M148.96,201.64c3.65,1.22,6.91,3.3,10.23,5.21a862.218,862.218,0,0,0,142.48,63.44c1.74.78,4.16,1.11,4.98,3.09,1.72,4.49,2.65,9.24,4.1,13.82,2.1,7.77,5.51,15.1,7.54,22.88-4.52-.35-8.98-1.11-13.46-1.77-37.27-5.53-74.57-10.82-111.83-16.39a71.009,71.009,0,0,1-8.57-1.46c-1.41-.95-1.93-2.73-2.76-4.14C168.41,259.1,156.44,231.03,148.96,201.64Z"/>
                            </g>
                        </svg>
                        <p style={{
                            marginBlock: 0,
                            fontSize: 24,
                            padding: 0,
                            marginTop: 0,
                            marginBottom: 0,
                            marginLeft: 10,
                            marginRight: 0,
                            color: "#37475b",
                        }}>{config.title}</p>
                        <p style={{
                            marginBlock: 0,
                            fontSize: 20,
                            padding: 0,
                            marginTop: 0,
                            marginBottom: 0,
                            marginLeft: 20,
                            marginRight: 0,
                            color: "#64778b",
                        }}>{formatDate(article.createdAt)}</p>
                    </div>
                </div>
                <div style={{width: 860, fontSize: 24, color: "#64778b", height: 108, overflow: "hidden"}}>
                    {article.description}
                </div>
            </div>
        </div>,
        {
            width: 1300,
            height: 630,
            headers: {
                "Cache-Control": "public, max-age=86400",
            }
        },
    );
}
