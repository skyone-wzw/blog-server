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
        result[key] = obj[key]
    })
    return result;
}
