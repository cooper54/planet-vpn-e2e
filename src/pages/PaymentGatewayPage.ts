import { Page, expect } from '@playwright/test';
import { PaymentMethod } from '../data/paymentMethods';
import { amountPattern } from '../utils/testData';

export class PaymentGatewayPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async expectOpened(method: PaymentMethod, expected: { price: string; email: string }) {
    // внешние платёжки грузятся дольше, даём больше времени на редирект
    await expect(this.page).toHaveURL(method.urlPattern, { timeout: 30_000 });

    const amount = amountPattern(expected.price);

    switch (method.id) {
      case 'card': // Stripe: итоговая сумма заказа и email
        await expect(this.page.getByTestId('product-summary-total-amount')).toHaveText(amount);
        await expect(this.page.getByText(expected.email, { exact: true })).toBeVisible();
        break;

      case 'crypto': // Heleket: сумма к оплате
        await expect(this.page.getByText(amount).first()).toBeVisible();
        break;

      case 'sbp': // x-hub показывает сумму, nspk — только QR-код
        if (this.page.url().includes('x-hub')) {
          await expect(this.page.getByText(amount).first()).toBeVisible();
        }
        break;
    }
  }
}