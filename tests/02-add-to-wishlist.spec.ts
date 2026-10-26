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
    await productPage.addToWishlist();
  });

  await test.step('product appears in the wish list', async () => {
    await wishlistPage.openWishlist();
    await expect(wishlistPage.item(product.sku)).toBeVisible();
  });

  setShared('wishlistProduct', product);
});
