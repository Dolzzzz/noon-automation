import { test, expect } from '../fixtures/test';
import { BasePage } from '../pages/BasePage';
import { dummyCard, productSearchTerm } from '../test-data/data';

// RULE: never complete a purchase. This flow stops once the dummy card is typed in —
// it never saves the card, confirms payment, or places the order.
test('04 · checkout up to filling in a new card (no purchase)', async ({ page, searchResults, productPage, cartPage, checkoutPage }) => {
  let sku = '';

  await test.step('add a product to the cart', async () => {
    await searchResults.openSearch(productSearchTerm);
    sku = BasePage.skuFromUrl(await searchResults.openFirstProduct());
    await productPage.addToCart();
  });

  await test.step('open the cart and proceed to checkout', async () => {
    await cartPage.openCart();
    await expect(cartPage.item(sku)).toBeVisible();
    await cartPage.proceedToCheckout();
  });

  await test.step('choose card payment and add a new card', async () => {
    await checkoutPage.selectCardPayment();
    await checkoutPage.openNewCardForm();
  });

  await test.step('fill in the dummy card details — and stop', async () => {
    const fields = await checkoutPage.fillCardDetails(dummyCard);
    await expect(fields.number).not.toHaveValue('');
    await expect(fields.cvv).not.toHaveValue('');
    // Hold on the filled form so it is visible in the demo video, then end the test.
    await page.waitForTimeout(3_000);
  });
});
