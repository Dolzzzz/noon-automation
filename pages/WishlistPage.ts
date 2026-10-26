import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class WishlistPage extends BasePage {
  readonly removeButtons = this.page.getByRole('button', { name: /إزالة|حذف|remove|delete|^المفضلة$/i });

  async openWishlist() {
    await this.open('/wishlist/');
  }

  /** The wishlist card for a product, matched by the SKU in its link. */
  item(sku: string) {
    return this.page.locator(`a[href*="/${sku}/"]`).first();
  }

  async removeItem(sku: string) {
    // The smallest block that holds both this product's link and a remove control is its card.
    const card = this.page
      .locator('div')
      .filter({ has: this.page.locator(`a[href*="/${sku}/"]`) })
      .filter({ has: this.removeButtons })
      .last();
    await card.locator(this.removeButtons).first().click();
    await expect(this.item(sku)).toBeHidden();
  }
}
