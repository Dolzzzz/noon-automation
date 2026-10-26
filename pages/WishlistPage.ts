import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class WishlistPage extends BasePage {
  async openWishlist() {
    await this.open('/wishlist/');
    // Cards load after the page shell; the "كل المنتجات (n)" heading arrives with them.
    await this.page
      .getByRole('heading', { name: /كل المنتجات/ })
      .first()
      .waitFor({ timeout: 15_000 })
      .catch(() => {});
  }

  /** The wishlist card for a product. Only the list's own cards count, not the recommendations below. */
  card(sku: string) {
    return this.page.locator('main article').filter({ has: this.page.locator(`a[href*="/${sku}/"]`) });
  }

  item(sku: string) {
    return this.card(sku).locator(`a[href*="/${sku}/"]`).first();
  }

  /** Removes a product through its card's "خيارات المنتج" (⋯) menu → "امسح من المفضلة". */
  async removeItem(sku: string) {
    await this.card(sku).getByRole('button', { name: 'خيارات المنتج' }).click();
    await this.page.getByText('امسح من المفضلة', { exact: true }).click();
    await expect(this.card(sku)).toHaveCount(0);
  }
}
