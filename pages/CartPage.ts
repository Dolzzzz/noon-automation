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
    await this.page.waitForURL(/checkout/);
  }
}
