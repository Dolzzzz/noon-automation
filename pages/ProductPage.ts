import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductPage extends BasePage {
  readonly productName = this.page.locator('[data-qa="pdp-product-name"]');
  readonly wishlistButton = this.page.getByRole('button', { name: 'wishlist' }).first();
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
