import Paper from "@/components/base/Paper";
import config from "@/config";
import Image from "next/image";
import Link from "next/link";

function EmailIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path
                d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-.4 4.25-7.07 4.42c-.32.2-.74.2-1.06 0L4.4 8.25a.85.85 0 1 1 .9-1.44L12 11l6.7-4.19a.85.85 0 1 1 .9 1.44z"/>
        </svg>
    );
}

function RssFeedIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <circle cx="6.18" cy="17.82" r="2.18"/>
            <path
                d="M5.59 10.23c-.84-.14-1.59.55-1.59 1.4 0 .71.53 1.28 1.23 1.4 2.92.51 5.22 2.82 5.74 5.74.12.7.69 1.23 1.4 1.23.85 0 1.54-.75 1.41-1.59a9.894 9.894 0 0 0-8.19-8.18zm-.03-5.71C4.73 4.43 4 5.1 4 5.93c0 .73.55 1.33 1.27 1.4 6.01.6 10.79 5.38 11.39 11.39.07.73.67 1.28 1.4 1.28.84 0 1.5-.73 1.42-1.56-.73-7.34-6.57-13.19-13.92-13.92z"/>
        </svg>
    );
}

function GithubIcon() {
    return (
        <svg stroke="currentColor" fill="currentColor"
             strokeWidth="0" viewBox="0 0 16 16" height="24px" width="24px"
             xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd"
                  d="M7.976 0A7.977 7.977 0 0 0 0 7.976c0 3.522 2.3 6.507 5.431 7.584.392.049.538-.196.538-.392v-1.37c-2.201.49-2.69-1.076-2.69-1.076-.343-.93-.881-1.175-.881-1.175-.734-.489.048-.489.048-.489.783.049 1.224.832 1.224.832.734 1.223 1.859.88 2.3.685.048-.538.293-.88.489-1.076-1.762-.196-3.621-.881-3.621-3.964 0-.88.293-1.566.832-2.153-.05-.147-.343-.978.098-2.055 0 0 .685-.196 2.201.832.636-.196 1.322-.245 2.007-.245s1.37.098 2.006.245c1.517-1.027 2.202-.832 2.202-.832.44 1.077.146 1.908.097 2.104a3.16 3.16 0 0 1 .832 2.153c0 3.083-1.86 3.719-3.62 3.915.293.244.538.733.538 1.467v2.202c0 .196.146.44.538.392A7.984 7.984 0 0 0 16 7.976C15.951 3.572 12.38 0 7.976 0z"/>
        </svg>
    );
}

function ZhihuIcon() {
    return (
        <svg stroke="currentColor" fill="currentColor"
             strokeWidth="0" viewBox="0 0 1024 1024" height="24px" width="24px"
             xmlns="http://www.w3.org/2000/svg">
            <path
                d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zM432.3 592.8l71 80.7c9.2 33-3.3 63.1-3.3 63.1l-95.7-111.9v-.1c-8.9 29-20.1 57.3-33.3 84.7-22.6 45.7-55.2 54.7-89.5 57.7-34.4 3-23.3-5.3-23.3-5.3 68-55.5 78-87.8 96.8-123.1 11.9-22.3 20.4-64.3 25.3-96.8H264.1s4.8-31.2 19.2-41.7h101.6c.6-15.3-1.3-102.8-2-131.4h-49.4c-9.2 45-41 56.7-48.1 60.1-7 3.4-23.6 7.1-21.1 0 2.6-7.1 27-46.2 43.2-110.7 16.3-64.6 63.9-62 63.9-62-12.8 22.5-22.4 73.6-22.4 73.6h159.7c10.1 0 10.6 39 10.6 39h-90.8c-.7 22.7-2.8 83.8-5 131.4H519s12.2 15.4 12.2 41.7h-110l-.1 1.5c-1.5 20.4-6.3 43.9-12.9 67.6l24.1-18.1zm335.5 116h-87.6l-69.5 46.6-16.4-46.6h-40.1V321.5h213.6v387.3zM408.2 611s0-.1 0 0zm216 94.3l56.8-38.1h45.6-.1V364.7H596.7v302.5h14.1z"></path>
        </svg>
    );
}

interface AsideProfileProps {
    className?: string;
}

const profile = config.master;

async function AsideProfile({className}: AsideProfileProps) {
    return (
        <Paper className={className}>
            <Image alt="profil" src={profile.cover} className="w-full mb-4 object-cover rounded-t-lg h-28"/>
            <div className="flex flex-col items-center justify-center p-4 -mt-16">
                <Image alt="profil" src={profile.avatar} height={64} width={64}
                       className="mx-auto object-cover rounded-full"/>
                <Link href="/login" className="mt-2 text-xl font-medium text-text-main">
                    {profile.name}
                </Link>
                <p className="mt-2 text-xs text-text-subnote">
                    {profile.description}
                </p>
                <div className="w-full mt-2 flex justify-around text-sm text-text-subnote">
                    {profile.github && (
                        <Link className="flex flex-col hover:text-link-hover px-2 lg:px-4 py-2 hover:bg-bg-hover rounded"
                              title="建议没收违法所得" target="_blank"
                              href={`https://github.com/${profile.github}`}>
                            <GithubIcon/>
                        </Link>
                    )}
                    {profile.zhihu && (
                        <Link className="flex flex-col hover:text-link-hover px-2 lg:px-4 py-2 hover:bg-bg-hover rounded"
                              title="去B乎看看吧~" target="_blank"
                              href={`https://github.com/${profile.github}`}>
                            <ZhihuIcon/>
                        </Link>
                    )}
                    {profile.email && (
                        <Link
                            className="flex flex-col hover:text-link-hover fill-current px-2 lg:px-4 py-2 rounded hover:bg-bg-hover"
                            title="要给我发邮件吗？"
                            href={`mailto:${profile.email}`}>
                            <EmailIcon/>
                        </Link>
                    )}
                    <Link
                        className="flex flex-col hover:text-link-hover fill-current px-2 lg:px-4 py-2 rounded hover:bg-bg-hover"
                        title="订阅我的RSS吧~"
                        href={`#`}>
                        <RssFeedIcon/>
                    </Link>
                </div>
            </div>
        </Paper>
    );
}

export default AsideProfile;
