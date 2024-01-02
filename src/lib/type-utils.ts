export function ObjectOmit<T, KT extends keyof T>(obj: T, keys: KT[]): Omit<T, KT> {
    const result = {...obj};
    keys.forEach((key) => {
        delete result[key];
    });
    return result;
}
