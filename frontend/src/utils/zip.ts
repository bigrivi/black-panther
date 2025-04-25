export const zip = (...arr: any[]) =>
    Array.from({ length: Math.max(...arr.map((a) => a.length)) }).map((_, i) =>
        arr.map((a) => a[i])
    );
