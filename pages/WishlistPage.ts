import { expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { ProductPage } from './ProductPage';

export class WishlistPage extends BasePage {
  async openWishlist() {
    await this.open('/wishlist/');
  }

  /** The wishlist card for a product, matched by the SKU in its link. */
  item(sku: string) {
    return this.page.locator(`a[href*="/${sku}/"]`).first();
  }

  card(sku: string) {
    return this.page.locator('article').filter({ has: this.page.locator(`a[href*="/${sku}/"]`) });
  }

  /**
   * Removes a product from the wish list using the card's "خيارات المنتج" (⋯) menu.
   * If that menu has no remove entry, falls back to un-hearting it on its product page.
   * Returns which way it was removed.
   */
  async removeItem(sku: string, productUrl: string): Promise<'wishlist menu' | 'product page heart'> {
    await this.card(sku).getByRole('button', { name: 'خيارات المنتج' }).click();
    const removeOption = this.page.getByText(/^(امسح من المفضلة|إزالة|حذف|Remove)/).first();
    if (await removeOption.waitFor({ state: 'visible', timeout: 5_000 }).then(() => true, () => false)) {
      await removeOption.click();
      await expect(this.item(sku)).toBeHidden();
      return 'wishlist menu';
    }

    await this.page.keyboard.press('Escape');
    await this.page.goto(productUrl, { waitUntil: 'domcontentloaded' });
    await this.waitForAppReady();
    await new ProductPage(this.page).toggleWishlist();
    return 'product page heart';
  }
}
