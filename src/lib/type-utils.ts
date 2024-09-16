export type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>;
};

export function ObjectOmit<T, KT extends keyof T>(obj: T, keys: KT[]): Omit<T, KT> {
    const result = {...obj};
    keys.forEach((key) => {
        delete result[key];
    });
    return result;
}

export function ObjectPick<T, KT extends keyof T>(obj: T, keys: KT[]): Pick<T, KT> {
    const result = {} as Pick<T, KT>;
    keys.forEach((key) => {
        result[key] = obj[key];
    });
    return result;
}

function isObject(item: any) {
    return (item && typeof item === "object" && !Array.isArray(item));
}

export function DeepMerge<T extends object>(target: T, ...sources: DeepPartial<T>[]): T {
    if (!sources.length) return target;
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, {[key]: {}});
                // @ts-ignore
                DeepMerge(target[key], source[key]);
            } else {
                Object.assign(target, {[key]: source[key]});
            }
        }
    }

    return DeepMerge(target, ...sources);
}

export function DeepMergeTemplate<T extends object>(target: T, ...sources: any[]): T {
    if (!sources.length) return target;
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in target) {
            // @ts-ignore
            if (source?.[key] && typeof source[key] === typeof target[key]) {
                // @ts-ignore
                if (isObject(source[key])) {
                    // @ts-ignore
                    DeepMergeTemplate(target[key], source[key]);
                } else {
                    // @ts-ignore
                    target[key] = source[key];
                }
            }
        }
    }

    return DeepMergeTemplate(target, ...sources);
}
