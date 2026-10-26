import { expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { LocationPicker } from './LocationPicker';

export class CartPage extends BasePage {
  readonly checkoutButton = this.page.getByRole('button', { name: /صفحة الدفع|إتمام الطلب|checkout/i }).first();
  private readonly picker = new LocationPicker(this.page);

  async openCart() {
    await this.open('/cart/');
  }

  item(sku: string) {
    return this.page.locator(`a[href*="/${sku}/"]`).first();
  }

  /**
   * Clicks "صفحة الدفع" and lands on /checkout. Clicked before noon has loaded the selected
   * address, the button asks "تسليم إلى" first; then the address already shown in the header
   * is picked, so the delivery location does not change, and checkout continues.
   */
  async proceedToCheckout() {
    await expect(this.checkoutButton).toBeEnabled();
    await this.page.waitForLoadState('load');
    await this.page.waitForTimeout(5_000);

    const phonePrompt = this.page.getByText('تأكيد رقم الموبايل');
    const onCheckout = () => /\/checkout/.test(this.page.url());
    await expect(async () => {
      if (onCheckout()) return;
      if (await this.picker.deliverToTitle.isVisible()) {
        await this.picker.chooseCurrentAddress(await this.picker.currentLocationText());
      } else {
        await this.checkoutButton.click({ timeout: 5_000 });
      }
      await expect
        .poll(async () => onCheckout() || (await phonePrompt.isVisible()) || (await this.picker.deliverToTitle.isVisible()), { timeout: 15_000 })
        .toBe(true);
      await this.failIfPhoneVerificationAsked(500);
      expect(onCheckout(), 'still on the cart').toBe(true);
    }).toPass({ timeout: 90_000, intervals: [1_000] });
  }
}
