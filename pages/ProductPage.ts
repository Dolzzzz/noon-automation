import { expect, type Request } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductPage extends BasePage {
  readonly productName = this.page.locator('[data-qa="pdp-product-name"]');
  // The gallery heart: "wishlist" when signed out, "المفضلة" when signed in. Scoped to the product
  // itself so a recommended product's heart further down can never be clicked by mistake.
  readonly wishlistButton = this.page
    .locator('[data-qa="pdp-container"]')
    .getByRole('button', { name: /^(المفضلة|wishlist)$/ })
    .first();
  readonly addToCartButton = this.page.getByRole('button', { name: /أضف إلى العربة|أضف للعربة|Add to cart/i }).first();
  readonly cartStepperMinus = this.page.getByRole('button', { name: 'remove-from-cart' }).first();

  async name(): Promise<string> {
    return (await this.productName.innerText()).trim();
  }

  /**
   * Clicks the heart once and waits for noon's save request. The heart is a toggle, so a second
   * click is only made if the first sent nothing at all (a click before hydration is dropped).
   */
  async toggleWishlist() {
    await expect(this.wishlistButton).toBeVisible();
    // The buy box only renders once the page has hydrated, so it marks "ready for clicks".
    await expect(this.addToCartButton.or(this.cartStepperMinus).first()).toBeVisible({ timeout: 60_000 });

    const saves: Request[] = [];
    const onRequest = (r: Request) => {
      if (r.url().includes('/wishlist/items/') && r.method() === 'POST') saves.push(r);
    };
    this.page.on('request', onRequest);
    try {
      for (let attempt = 1; attempt <= 3 && saves.length === 0; attempt++) {
        await this.wishlistButton.click();
        await expect.poll(() => saves.length, { timeout: 10_000 }).toBeGreaterThan(0).catch(() => {});
      }
    } finally {
      this.page.off('request', onRequest);
    }
    expect(saves, 'exactly one wishlist save request').toHaveLength(1);
    expect((await saves[0].response())?.ok()).toBe(true);
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
