export function uniqueEmail(): string {
  const [name, domain] = (process.env.TEST_EMAIL ?? 'planet.vpn.qa@gmail.com').split('@');

  return `${name}+${Date.now()}@${domain}`;
}

export function amountPattern(price: string): RegExp {
  const [whole, fraction] = price.split('.');
  const wholePart = whole.replace(/\B(?=(\d{3})+$)/g, '[\\s,.\\u00a0]?');
  const fractionPart = fraction ? `[.,]${fraction}` : '([.,]00)?';

  return new RegExp(`(^|[^\\d])${wholePart}${fractionPart}([^\\d]|$)`);
}
