export type Currency = 'USD' | 'EUR' | 'RUB';
export const currencies: Currency[] = ['USD', 'EUR', 'RUB'];

export interface Plan {
    offerId: string;
    title: string;
    prices: Record<Currency, string>;
}

export const plans: Plan[] = [
{
    offerId: '1_month',
    title: '1 month',
    prices: { USD: '6.90', EUR: '6.90', RUB: '499' },
},

{
    offerId: '1_year',
    title: '1 year',
    prices: { USD: '39', EUR: '39', RUB: '2990' },
},
];