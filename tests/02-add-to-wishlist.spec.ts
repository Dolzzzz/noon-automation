import { test, expect } from '../fixtures/test';
import { BasePage } from '../pages/BasePage';
import { productSearchTerm } from '../test-data/data';
import { setShared } from '../utils/shared-state';

test('02 · add a product to the wish list', async ({ searchResults, productPage, wishlistPage }) => {
  let product!: { sku: string; name: string; url: string };

  await test.step('open a product from search results', async () => {
    await searchResults.openSearch(productSearchTerm);
    const url = await searchResults.openFirstProduct();
    product = { sku: BasePage.skuFromUrl(url), name: await productPage.name(), url };
  });

  await test.step('click the wish list heart', async () => {
    await productPage.toggleWishlist();
  });

  await test.step('product appears in the wish list', async () => {
    await wishlistPage.openWishlist();
    // The heart toggles: if this fails, an earlier aborted run probably left the product
    // wish-listed and this click removed it. Run flow 03 (or clear the wish list) and retry.
    await expect(wishlistPage.item(product.sku)).toBeVisible({ timeout: 30_000 });
  });

  setShared('wishlistProduct', product);
});
