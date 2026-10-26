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

  async addToWishlist() {
    await expect(this.wishlistButton).toBeVisible();
    await this.wishlistButton.click();
  }

  async addToCart() {
    await expect(this.addToCartButton).toBeEnabled({ timeout: 60_000 });
    await this.addToCartButton.click();
  }
}
