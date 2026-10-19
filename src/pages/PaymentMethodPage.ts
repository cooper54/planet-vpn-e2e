import { Page, Locator, expect } from '@playwright/test';
import { PaymentMethod } from '../data/paymentMethods';

export class PaymentMethodPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly termsCheckbox: Locator;
  readonly termsLabel: Locator;
  readonly payButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Choose payment method' });
    this.termsCheckbox = page.locator('#qa-checkbox-terms');
    this.termsLabel = page.locator('label', { has: this.termsCheckbox });
    this.payButton = page.locator('#qa-btn-submit-step2');
  }

  methodRadio(method: PaymentMethod): Locator {
    return method.qaId
      ? this.page.locator(`#${method.qaId}`)
      : this.page.getByRole('radio', { name: method.label });
  }

  async expectOpened(expected?: { offerId: string; currency: string; location: string }) {
    await expect(this.page).toHaveURL(/\/payment\//);
    await expect(this.heading).toBeVisible();

    if (expected) {
      const params = new URL(this.page.url()).searchParams;
      expect(params.get('offer_id'), 'тариф').toBe(expected.offerId);
      expect(params.get('currency_code'), 'валюта').toBe(expected.currency);
      expect(params.get('location'), 'страна').toBe(expected.location);
    }
  }

  async selectMethod(method: PaymentMethod) {
    await this.page.locator('label', { has: this.methodRadio(method) }).click();
    await expect(this.methodRadio(method)).toBeChecked();
    return this;
  }

  async acceptTerms() {
    await this.termsLabel.click();
    await expect(this.termsCheckbox).toBeChecked();
    return this;
  }

  async submit() {
    await this.payButton.click();
  }
}