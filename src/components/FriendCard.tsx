import Paper from "@/components/base/Paper";
import {ClientFriend} from "@/lib/friends";
import Image from "next/image";
import Link from "next/link";

export function getAvatarElement(friend: ClientFriend) {
    if (friend.avatar && friend.avatar.startsWith("http")) {
        // 外部链接
        // eslint-disable-next-line @next/next/no-img-element
        return  <img className="w-16 h-16 rounded-lg" src={friend.avatar} alt={friend.name}/>;
    } else if (friend.avatar) {
        // 内部链接
        return  <Image className="w-16 h-16 rounded-lg" src={friend.avatar} width={64} height={64} alt={friend.name}/>
    } else {
        // 没有头像
        return  (
            <svg fill="currentColor" viewBox="0 0 496 512" height="64" width="64"
                 className="w-16 h-16 rounded-lg"
                 xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M248 104c-53 0-96 43-96 96s43 96 96 96 96-43 96-96-43-96-96-96zm0 144c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm0-240C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 448c-49.7 0-95.1-18.3-130.1-48.4 14.9-23 40.4-38.6 69.6-39.5 20.8 6.4 40.6 9.6 60.5 9.6s39.7-3.1 60.5-9.6c29.2 1 54.7 16.5 69.6 39.5-35 30.1-80.4 48.4-130.1 48.4zm162.7-84.1c-24.4-31.4-62.1-51.9-105.1-51.9-10.2 0-26 9.6-57.6 9.6-31.5 0-47.4-9.6-57.6-9.6-42.9 0-80.6 20.5-105.1 51.9C61.9 339.2 48 299.2 48 256c0-110.3 89.7-200 200-200s200 89.7 200 200c0 43.2-13.9 83.2-37.3 115.9z"></path>
            </svg>
        )
    }
}

interface FriendCardProps {
    friend: ClientFriend;
    className?: string;
}

function FriendCard({friend, className}: FriendCardProps) {
    const avatarElement = getAvatarElement(friend);

    return (
        <Link title={friend.siteName} href={friend.siteUrl} target="_blank" className={className}>
            <Paper
                className={"flex flex-row items-center hover:bg-bg-hover outline outline-1 outline-bg-quote"}>
                <div className="aspect-square">
                    {avatarElement}
                </div>
                <div className="p-2 w-0 grow">
                    <p className="text-text-content text-ellipsis whitespace-nowrap break-all overflow-hidden">
                        {friend.siteName}&nbsp;
                    </p>
                    <p className="text-sm text-text-subnote text-ellipsis whitespace-nowrap break-all overflow-hidden">
                        {friend.description}&nbsp;
                    </p>
                </div>
            </Paper>
        </Link>
    );
}

export default FriendCard;
