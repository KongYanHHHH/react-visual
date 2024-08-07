function debounce<T extends (...rest: any[]) => any>(
    func: T,
    delay: number,
    immediate = false,
): (...rest: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;

    return function (this: any, ...rest: Parameters<T>) {
        const ctx = this;

        const later = function () {
            timeout = null;
            if (!immediate) func.apply(ctx, rest);
        };

        const callNow = immediate && !timeout;

        clearTimeout(timeout as unknown as number);

        timeout = setTimeout(later, delay);

        if (callNow) func.apply(ctx, rest);
    };
}

export default debounce;
