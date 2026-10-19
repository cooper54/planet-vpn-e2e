import {test, expect} from '@playwright/test';

test('Monthly plan + credit card -> Stripe checkout', async ({ page }) => {
    const email = `autotest+${Date.now()}@gmail.com.com`;

    await page.goto('/');
    await page.locator('label:has(#qa-radio-offer-1-month)').click();
    await expect(page.locator('#qa-radio-offer-1-month')).toBeChecked();
    await expect(page.locator('b[data-offer_id="1_month"]')).toHaveText('6.90 $');  
    await page.locator('#qa-input-email').fill(email);
    await page.locator('#qa-btn-submit-step1').click();

    // choose payment method page
    await expect(page).toHaveURL(/\/payment\//);
    await expect(page.locator('#qa-radio-gateway-stripe')).toBeChecked();
    await page.locator('label:has(#qa-checkbox-terms)').click();
    await expect(page.locator('#qa-checkbox-terms')).toBeChecked();
    await page.locator('#qa-btn-submit-step2').click();

    // Stripe checkout page
    await expect(page).toHaveURL(/^https:\/\/checkout\.stripe\.com\//, { timeout: 30_000 });
    await expect(page.getByTestId('product-summary-total-amount')).toHaveText(/6[.,]90/);
    await expect(page.getByText(email, { exact: true })).toBeVisible();
});