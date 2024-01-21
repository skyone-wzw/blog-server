import Paper from "@/components/base/Paper";
import Link from "next/link";

interface RouterItem {
    name: string;
    url: string;
}

function AdminLeftPage() {
    const routers: RouterItem[] = [
        {
            name: "管理面板",
            url: "/admin",
        },
        {
            name: "文章编辑",
            url: "/editor",
        },
        {
            name: "友情链接",
            url: "/admin/friends",
        }
    ];

    return (
        <div className="mb-6 col-start-1">
            <Paper className="p-4 divide-y divide-bg-tag">
                <h2 className="mb-2 text-text-subnote">管理设置</h2>
                {routers.map((router, index) => (
                    <Link className="block p-2 text-text-content justify-between hover:bg-bg-hover"
                          href={router.url} key={index}>
                        {router.name}
                    </Link>
                ))}
            </Paper>
        </div>
    );
}

export default AdminLeftPage;
