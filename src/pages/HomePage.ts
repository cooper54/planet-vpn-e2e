import { Page, Locator, expect } from '@playwright/test';
import { Currency } from '../data/plans';

export class HomePage {
  readonly page: Page;
  readonly form: Locator;
  readonly emailInput: Locator;
  readonly submitButton: Locator;
  readonly locationSelect: Locator;
  readonly currencySelect: Locator;
  readonly heading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.form = page.locator('form#PPG');
    this.emailInput = page.locator('#qa-input-email');
    this.submitButton = page.locator('#qa-btn-submit-step1');
    this.locationSelect = page.locator('label[data-name="location"] .ppg__select-display');
    this.currencySelect = page.locator('label[data-name="currency_code"] .ppg__select-display');
    this.heading = page.locator('#PPG h2');
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

  async expectPlanPrice(offerId: string, price: string) {
    await expect(this.page.locator(`b[data-offer_id="${offerId}"]`)).toContainText(price);
  }

  async selectLocation(code: string) {
    await this.locationSelect.click();
    await this.page.locator(`#qa-select-location-${code.toLowerCase()}`).click();
    await expect(this.form).toHaveAttribute('data-location', code);
    await this.closeDropdown('location');

    return this;
  }
  async selectCurrency(currency: Currency) {
    await this.currencySelect.click();
    await this.page.locator(`#qa-select-currency-${currency.toLowerCase()}`).click();
    await expect(this.form).toHaveAttribute('data-currency_code', currency);
    await this.closeDropdown('currency_code');

    return this;
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);

    return this;
  }

  async submit() {
    await this.submitButton.click();
  }

  // Выпадающие списки не всегда закрываются сами и перекрывают тарифы.
  // Первые 100 мс после открытия сайт игнорирует клики (debounce в script.js плагина),
  // поэтому кликаем вне списка повторно, пока он не закроется
  private async closeDropdown(name: 'location' | 'currency_code') {
    const list = this.page.locator(`label[data-name="${name}"] ul`);
    await expect(async () => {
      if (await list.isVisible()) {
        await this.heading.click();
      }
      await expect(list).toBeHidden({ timeout: 1_000 });
    }).toPass();
  }
}   