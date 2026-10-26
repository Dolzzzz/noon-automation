import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly checkoutButton = this.page.getByRole('button', { name: /إتمام الطلب|الدفع|checkout/i }).first();

  async openCart() {
    await this.open('/cart/');
  }

  item(sku: string) {
    return this.page.locator(`a[href*="/${sku}/"]`).first();
  }

  async proceedToCheckout() {
    await expect(this.checkoutButton).toBeEnabled();
    await this.checkoutButton.click();
    const phonePrompt = this.page.getByText('تأكيد رقم الموبايل');
    await expect
      .poll(async () => /\/checkout/.test(this.page.url()) || (await phonePrompt.isVisible()), { timeout: 60_000 })
      .toBe(true);
    await this.failIfPhoneVerificationAsked(1_000);
  }
}
