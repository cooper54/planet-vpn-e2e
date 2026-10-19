import { Page, expect } from '@playwright/test';
import { PaymentMethod } from '../data/paymentMethods';
import { amountPattern } from '../utils/testData';

const REDIRECT_TIMEOUT = 40_000;
const GATEWAY_CONTENT_TIMEOUT = 30_000;

export class PaymentGatewayPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async expectOpened(method: PaymentMethod, expected: { price: string; email: string }) {
    // Внешние платёжки грузятся дольше, даём больше времени на редирект
    await expect(this.page).toHaveURL(method.urlPattern, { timeout: REDIRECT_TIMEOUT });

    const amount = amountPattern(expected.price);
    const timeout = GATEWAY_CONTENT_TIMEOUT;

    switch (method.id) {
      case 'card': // Stripe: итоговая сумма заказа и email
        await expect(this.page.getByTestId('product-summary-total-amount')).toHaveText(amount, { timeout });
        await expect(this.page.getByText(expected.email, { exact: true })).toBeVisible({ timeout });
        break;

      case 'crypto': // Heleket: сумма к оплате
        await expect(this.page.getByText(amount).first()).toBeVisible({ timeout });
        break;

      case 'sbp': // x-hub показывает сумму, nspk — только QR-код
        if (this.page.url().includes('x-hub')) {
          await expect(this.page.getByText(amount).first()).toBeVisible({ timeout });
        }
        break;
    }
  }
}