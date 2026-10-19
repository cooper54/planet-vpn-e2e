import { test, expect } from '../src/fixtures';
import { currencies, plans } from '../src/data/plans';
import { methodsNotFor } from '../src/data/paymentMethods';
import { uniqueEmail } from '../src/utils/testData';

test.describe('Payment method page (negative)', () => {
  const plan = plans[0];

  // для каждой валюты проверяем, что недоступных в ней способов оплаты нет на странице
  for (const currency of currencies) {
    const unavailable = methodsNotFor(currency);
    if (unavailable.length === 0) continue; // в RUB доступно всё, проверять нечего

    test(`${currency}: hides ${unavailable.map((m) => m.name).join(', ')}`, async ({
      homePage,
      paymentMethodPage,
    }) => {
      await homePage.open();
      await homePage.selectCurrency(currency);
      await homePage.selectPlan(plan.offerId);
      await homePage.fillEmail(uniqueEmail());
      await homePage.submit();
      await paymentMethodPage.expectOpened();

      for (const method of unavailable) {
        await expect(paymentMethodPage.methodRadio(method)).toHaveCount(0);
      }
    });
  }

  test('Pay is blocked until terms are accepted', async ({ page, homePage, paymentMethodPage }) => {
    await homePage.open();
    await homePage.selectPlan(plan.offerId);
    await homePage.fillEmail(uniqueEmail());
    await homePage.submit();
    await paymentMethodPage.expectOpened();

    const urlBefore = page.url();
    await paymentMethodPage.submit(); // жмём Pay, не поставив галочку

    await expect(page).toHaveURL(urlBefore);                                   // никуда не ушли
    await expect(paymentMethodPage.termsCheckbox).not.toBeChecked();
    await expect(page.locator('#qa-checkbox-terms:invalid')).toHaveCount(1);   // браузер пометил поле как незаполненное
  });
});