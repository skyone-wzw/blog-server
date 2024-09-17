import Paper from "@/components/base/Paper";
import {getCacheSize, getDatabaseSize, getMemoryUsage, getSystemUsage, humanReadableSize} from "@/lib/system-usage";
import clsx from "clsx";

interface SystemUsageProps {
    className?: string;
}

async function SystemUsage({className}: SystemUsageProps) {
    const databaseSize = await getDatabaseSize();
    const nodeMemoryUsage = await getMemoryUsage();
    const systemUsage = await getSystemUsage();
    const cacheSize = await getCacheSize();

    return (
        <Paper className={clsx("p-4", className)}>
            <h2 className="mb-2 text-text-subnote">系统负载</h2>
            <div className="divide-y divide-bg-tag border-y border-bg-tag">
                <div className="flex justify-start items-center flex-row p-2 gap-y-2">
                    <span className="basis-28 flex-grow">数据库大小</span>
                    <span className="flex-shrink-0">{humanReadableSize(databaseSize)}</span>
                </div>
                <div className="flex justify-start items-center flex-row p-2 gap-y-2">
                    <span className="basis-28 flex-grow">缓存大小</span>
                    <span className="flex-shrink-0">{humanReadableSize(cacheSize)}</span>
                </div>
                <div className="flex justify-start items-center flex-row p-2 gap-y-2">
                    <span className="basis-28 flex-grow">内存占用</span>
                    <span className="flex-shrink-0">{humanReadableSize(nodeMemoryUsage.rss)}</span>
                </div>
                <div className="flex justify-start items-center flex-row p-2 gap-y-2">
                    <span className="basis-28 flex-grow">系统内存</span>
                    <span className="flex-shrink-0">{humanReadableSize(systemUsage.total)}</span>
                </div>
                <div className="flex justify-start items-center flex-row p-2 gap-y-2">
                    <span className="basis-28 flex-grow">系统内存占用</span>
                    <span className="flex-shrink-0">{humanReadableSize(systemUsage.usage)}</span>
                </div>
                <div className="flex justify-start items-center flex-row p-2 gap-y-2">
                    <span className="basis-28 flex-grow">系统内存占比</span>
                    <span className="flex-shrink-0">{systemUsage.percentage.toFixed(2)}%</span>
                </div>
            </div>
        </Paper>
    )
}

export default SystemUsage;
