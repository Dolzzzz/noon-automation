import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductPage extends BasePage {
  readonly productName = this.page.locator('[data-qa="pdp-product-name"]');
  // The gallery heart: "wishlist" when signed out, "المفضلة" when signed in. It is the first such button on the page.
  readonly wishlistButton = this.page.getByRole('button', { name: /^(المفضلة|wishlist)$/ }).first();
  readonly addToCartButton = this.page.getByRole('button', { name: /أضف إلى العربة|أضف للعربة|Add to cart/i }).first();
  readonly cartStepperMinus = this.page.getByRole('button', { name: 'remove-from-cart' }).first();

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

  /**
   * Adds the product to the cart. Once it is in the cart, noon swaps the button for a quantity
   * stepper whose "−" (remove-from-cart) is enabled, so that is both the "already there" check
   * and the proof the add worked.
   */
  async addToCart() {
    await expect(async () => {
      if (await this.cartStepperMinus.isEnabled()) return;
      await this.addToCartButton.click({ timeout: 5_000 });
      await expect(this.cartStepperMinus).toBeEnabled({ timeout: 5_000 });
    }).toPass({ timeout: 60_000, intervals: [1_000, 2_000] });
  }
}
