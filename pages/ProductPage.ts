import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductPage extends BasePage {
  readonly productName = this.page.locator('[data-qa="pdp-product-name"]');
  // The gallery heart: "wishlist" when signed out, "المفضلة" when signed in. It is the first such button on the page.
  readonly wishlistButton = this.page.getByRole('button', { name: /^(المفضلة|wishlist)$/ }).first();
  readonly addToCartButton = this.page.getByRole('button', { name: /أضف إلى العربة|أضف للعربة|Add to cart/i }).first();

  async name(): Promise<string> {
    return (await this.productName.innerText()).trim();
  }

  /**
   * Clicks the heart until noon actually sends the save request. A click before hydration is
   * dropped silently, and the heart is a toggle, so it must not be clicked again once one lands.
   */
  async toggleWishlist() {
    await expect(this.wishlistButton).toBeVisible();
    await expect(async () => {
      const saveRequest = this.page
        .waitForRequest(r => r.url().includes('/wishlist/items/') && r.method() === 'POST', { timeout: 5_000 })
        .catch(() => null);
      await this.wishlistButton.click({ timeout: 5_000 });
      const request = await saveRequest;
      if (!request) throw new Error('Heart click was not handled yet');
      expect((await request.response())?.ok()).toBe(true);
    }).toPass({ timeout: 45_000, intervals: [1_000, 2_000] });
  }

  async addToCart() {
    await expect(this.addToCartButton).toBeEnabled({ timeout: 60_000 });
    await this.addToCartButton.click();
  }
}
