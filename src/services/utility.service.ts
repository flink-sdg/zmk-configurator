export function formatCurrency(value: number): string {
    return '$' + value.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function smartInterval(callback: (clear: () => void) => void, duration: number) {
    let cleared: boolean = false;
    callback(() => {cleared = true;});

    if(!cleared) {
        const interval: number = setInterval(() => {
            callback(() => {clearInterval(interval)});
        }, duration);
    }
}