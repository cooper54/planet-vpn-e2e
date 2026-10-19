export function uniqueEmail(): string {
    if (process.env.TEST_EMAIL) return process.env.TEST_EMAIL;
    return `planet.vpn.qa+${Date.now()}@gmail.com`;
}

export function amountPattern(price: string): RegExp {
    const [whole, fraction] = price.split('.');
    const wholePart = whole.replace(/\B(?=(\d{3})+$)/g, '[\\s,.\\u00a0]?');
    const fractionPart = fraction ? `[.,]${fraction}` : '([.,]00)?';
    return new RegExp(`(^|[^\\d])${wholePart}${fractionPart}([^\\d]|$)`);
}