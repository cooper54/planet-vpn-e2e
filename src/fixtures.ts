import { test as base } from '@playwright/test';
import { HomePage } from './pages/HomePage';
import { PaymentMethodPage } from './pages/PaymentMethodPage';
import { PaymentGatewayPage } from './pages/PaymentGatewayPage';
export { expect } from '@playwright/test';

type Pages = {
  homePage: HomePage;
  paymentMethodPage: PaymentMethodPage;
  gatewayPage: PaymentGatewayPage;
};

export const test = base.extend<Pages>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  paymentMethodPage: async ({ page }, use) => {
    await use(new PaymentMethodPage(page));
  },
  gatewayPage: async ({ page }, use) => {
    await use(new PaymentGatewayPage(page));
  },
});
