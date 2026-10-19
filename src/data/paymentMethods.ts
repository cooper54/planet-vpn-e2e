import { Currency } from './plans';

export interface PaymentMethod {
    id: string;
    name: string;
    provider: string;
    qaId?: string;
    label: string;
    currencies: Currency[];
    urlPattern: RegExp;
}

export const paymentMethods: PaymentMethod[] = [
    {
        id: 'card',
        name: 'Credit Card',
        provider: 'Stripe',
        qaId: 'qa-radio-gateway-stripe',
        label: 'Credit Card',
        currencies: ['usd', 'eur', 'rub'],
        urlPattern: /checkout\.stripe\.com/,
    },
    
    {
        id: 'crypto',
        name: 'Cryptocurrency',
        provider: 'Heleket',
        qaId: 'qa-radio-gateway-crypto',
        label: 'Cryptocurrency',
        currencies: ['usd', 'eur', 'rub'],
        urlPattern: /pay\.heleket\.com/,
    },

    {
        id: 'sbp',
        name: 'Fast Payment System (SBP)',
        provider: 'NSPK',
        qaId: 'qa-radio-gateway-fast-payments',
        label: 'Система быстрых платежей',
        currencies: ['rub'],
        urlPattern: /pay\.x-hub\.online|qr\.nspk\.ru/,
    },
];

export function methodsFor(currency: Currency): PaymentMethod[] {
    return paymentMethods.filter((m) => m.currencies.includes(currency));
}

export function methodsNotFor(currency: Currency): PaymentMethod[] {
    return paymentMethods.filter((m) => !m.currencies.includes(currency));
}