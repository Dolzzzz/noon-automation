import { test, expect } from '../fixtures/test';
import { BasePage } from '../pages/BasePage';
import { dummyCard, productSearchTerm } from '../test-data/data';

// RULE: never complete a purchase. This flow stops once the dummy card is typed in.
// It unticks "remember this card", never clicks "تأكيد" (save card), never pays, never places an order.
test('04 · checkout up to filling in a new card (no purchase)', async ({ page, searchResults, productPage, cartPage, checkoutPage }) => {
  let sku = '';

  await test.step('add a product to the cart', async () => {
    await searchResults.openSearch(productSearchTerm);
    sku = BasePage.skuFromUrl(await searchResults.openFirstProduct());
    await productPage.addToCart();
  });

  await test.step('open the cart and go to the payment page', async () => {
    await cartPage.openCart();
    await expect(cartPage.item(sku)).toBeVisible();
    await cartPage.proceedToCheckout();
    await checkoutPage.waitForCheckout();
  });

  await test.step('choose credit card → add a new card', async () => {
    await checkoutPage.openNewCardForm();
  });

  await test.step('fill in the dummy card details — and stop', async () => {
    await checkoutPage.fillCardDetails(dummyCard);
    await expect(checkoutPage.cardNumber).not.toHaveValue('');
    await expect(checkoutPage.cvv).not.toHaveValue('');
    await expect(checkoutPage.rememberCardCheckbox).not.toBeChecked();
    // The form accepts the card (confirm is enabled), and the test deliberately ends here.
    await expect(checkoutPage.confirmCardButton).toBeEnabled();
    await page.waitForTimeout(3_000);
  });
});
