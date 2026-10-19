import { Page, Locator, expect } from '@playwright/test';
import { Currency } from '../data/plans';

export class HomePage {
  readonly page: Page;
  readonly form: Locator;
  readonly emailInput: Locator;
  readonly submitButton: Locator;
  readonly locationSelect: Locator;
  readonly currencySelect: Locator;

  constructor(page: Page) {
    this.page = page;
    this.form = page.locator('form#PPG');
    this.emailInput = page.locator('#qa-input-email');
    this.submitButton = page.locator('#qa-btn-submit-step1');
    this.locationSelect = page.locator('label[data-name="location"] .ppg__select-display');
    this.currencySelect = page.locator('label[data-name="currency_code"] .ppg__select-display');
  }

  async open() {
    await this.page.goto('/');
    await expect(this.form).toBeVisible();
    return this;
  }

  async selectPlan(offerId: string) {
    const id = offerId.replace('_', '-');
    await this.page.locator(`label:has(#qa-radio-offer-${id})`).click();
    await expect(this.page.locator(`#qa-radio-offer-${id}`)).toBeChecked();
    return this;
  }

  async selectLocation(code: string) {
    await this.locationSelect.click();                                       
    await this.page.locator(`#qa-select-location-${code.toLowerCase()}`).click();
    await expect(this.form).toHaveAttribute('data-location', code);
    return this;
}
  async selectCurrency(currency: Currency) {
    await this.currencySelect.click();
    await this.page.locator(`#qa-select-currency-${currency.toLowerCase()}`).click();
    await expect(this.form).toHaveAttribute('data-currency_code', currency);
    return this;
}

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
    return this;
  }

  async submit() {
    await this.submitButton.click();
  }
}   