export type Currency = 'usd' | 'eur' | 'rub';
export const currencies: Currency[] = ['usd', 'eur', 'rub'];

export interface Plan {
    offerId: string;
    title: string;
    prices: Record<Currency, string>;
}

export const plans: Plan[] = [
{
    offerId: '1_month',
    title: '1 month',
    prices: { usd: '6.90', eur: '6.90', rub: '499' },
},

{
    offerId: '1_year',
    title: '1 year',
    prices: { usd: '39', eur: '39', rub: '2990' },
},
];