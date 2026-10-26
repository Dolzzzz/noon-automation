import { test, expect } from '../fixtures/test';
import { getShared } from '../utils/shared-state';

test('03 · remove that product from the wish list', async ({ wishlistPage }) => {
  const product = getShared('wishlistProduct');
  test.skip(!product, 'Flow 02 must run first so there is a product to remove');

  await test.step('open the wish list', async () => {
    await wishlistPage.openWishlist();
    await expect(wishlistPage.item(product!.sku)).toBeVisible();
  });

  await test.step('remove the product added in flow 02', async () => {
    const how = await wishlistPage.removeItem(product!.sku, product!.url);
    test.info().annotations.push({ type: 'removed via', description: how });
  });

  await test.step('product is gone after a reload', async () => {
    await wishlistPage.openWishlist();
    await expect(wishlistPage.item(product!.sku)).toHaveCount(0);
  });
});
