import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class WishlistPage extends BasePage {
  async openWishlist() {
    await this.open('/wishlist/');
  }

  /** The wishlist card for a product, matched by the SKU in its link. */
  item(sku: string) {
    return this.page.locator(`a[href*="/${sku}/"]`).first();
  }

  async removeItem(sku: string) {
    const card = this.page.locator(`div:has(> a[href*="/${sku}/"]), div:has(a[href*="/${sku}/"])`).last();
    const removeButton = card.getByRole('button', { name: /إزالة|حذف|remove|delete|wishlist/i }).first();
    await removeButton.click();
    await expect(this.item(sku)).toBeHidden();
  }
}
