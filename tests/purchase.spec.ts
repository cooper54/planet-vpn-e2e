import { test } from '../src/fixtures';
import { currencies, plans } from '../src/data/plans';
import { methodsFor } from '../src/data/paymentMethods';
import { locations } from '../src/data/locations';
import { uniqueEmail } from '../src/utils/testData';

test.describe('Personal VPN purchase', () => {
  let caseIndex = 0;

  for (const plan of plans) {
    for (const currency of currencies) {
      for (const method of methodsFor(currency)) {
        const location = locations[caseIndex++ % locations.length];

        test(`${plan.title} | ${currency} | ${location.name} | ${method.name} -> ${method.provider}`, async ({
          homePage,
          paymentMethodPage,
          gatewayPage,
        }) => {
          const email = uniqueEmail();
          const price = plan.prices[currency];

          await test.step(`Select ${location.name}, ${currency}, ${plan.title}`, async () => {
            await homePage.open();
            await homePage.selectLocation(location.code);
            await homePage.selectCurrency(currency);
            await homePage.selectPlan(plan.offerId);
            await homePage.expectPlanPrice(plan.offerId, price);
          });

          await test.step('Enter email and go to payment method', async () => {
            await homePage.fillEmail(email);
            await homePage.submit();
            await paymentMethodPage.expectOpened({ offerId: plan.offerId, currency, location: location.code });
          });

          await test.step(`Choose ${method.name} and pay`, async () => {
            await paymentMethodPage.selectMethod(method);
            await paymentMethodPage.acceptTerms();
            await paymentMethodPage.submit();
          });

          await test.step(`Check redirect to ${method.provider}`, async () => {
            await gatewayPage.expectOpened(method, { price, email });
          });
        });
      }
    }
  }
});