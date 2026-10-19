import { test, expect } from '../src/fixtures';
import { currencies, plans } from '../src/data/plans';
import { methodsNotFor, paymentMethods } from '../src/data/paymentMethods';
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

  test('Invalid email format is blocked on step 1', async ({ page, homePage }) => {
    await homePage.open();
    await homePage.selectPlan(plan.offerId);
    await homePage.fillEmail('not-an-email');
    await homePage.submit();

    // браузер не отправил форму: остались на главной, поле помечено как невалидное
    await expect(page).not.toHaveURL(/\/payment\//);
    await expect(page.locator('#qa-input-email:invalid')).toHaveCount(1);
  });

  test('Undeliverable email domain is rejected after choosing payment method', async ({
    page,
    homePage,
    paymentMethodPage,
  }) => {
    const card = paymentMethods[0];

    await homePage.open();
    await homePage.selectPlan(plan.offerId);
    await homePage.fillEmail(`autotest+${Date.now()}@example.com`); // формат верный, домен без почтового сервера
    await homePage.submit();
    await paymentMethodPage.expectOpened();

    await paymentMethodPage.selectMethod(card);
    await paymentMethodPage.acceptTerms();
    await paymentMethodPage.submit();

    // заказ отклонён: вместо платёжки — страница ошибки
    await expect(page).toHaveURL(/\/payment\/failed\//);
    await expect(page.getByRole('heading', { name: /Something went wrong/ })).toBeVisible();
    await expect(page.getByText('Transaction was rejected')).toBeVisible();
  });
});