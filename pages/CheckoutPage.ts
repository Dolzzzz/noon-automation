import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  readonly addCardButton = this.page.getByRole('button', { name: /إضافة البطاقة/ }).first();
  readonly cardFormTitle = this.page.getByText('إضافة بطاقة جديدة', { exact: true });
  readonly cardNumber = this.page.locator('input[name="ccNumber"]');
  readonly expiryMonth = this.page.locator('input[name="cardExpiryMonth"]');
  readonly expiryYear = this.page.locator('input[name="cardExpiryYear"]');
  readonly cvv = this.page.locator('input[autocomplete="cc-csc"]');
  readonly nickname = this.page.locator('input[autocomplete="cc-card-nickname"]');
  readonly rememberCard = this.page.getByText('تذكر هذه البطاقة', { exact: true });
  readonly rememberCardCheckbox = this.page.locator('input[name="rememberCard"]');
  // Saves the card. The suite only checks it is enabled and NEVER clicks it.
  readonly confirmCardButton = this.page.getByRole('button', { name: 'تأكيد', exact: true });

  async waitForCheckout() {
    await expect(this.addCardButton).toBeVisible({ timeout: 60_000 });
  }

  async openNewCardForm() {
    await this.clickUntilVisible(this.addCardButton, this.cardFormTitle);
  }

  /** Types the dummy card into the new-card form and unticks "remember this card". Never saves or pays. */
  async fillCardDetails(card: { number: string; expiryMonth: string; expiryYear: string; cvv: string; holderName: string }) {
    await this.cardNumber.pressSequentially(card.number, { delay: 40 });
    await this.expiryMonth.pressSequentially(card.expiryMonth, { delay: 40 });
    // The year box takes either "30" or "2030" depending on its max length.
    const maxLength = Number((await this.expiryYear.getAttribute('maxlength')) ?? 4);
    await this.expiryYear.pressSequentially(maxLength === 2 ? card.expiryYear.slice(-2) : card.expiryYear, { delay: 40 });
    await this.cvv.pressSequentially(card.cvv, { delay: 40 });
    await this.nickname.fill(card.holderName);
    if (await this.rememberCardCheckbox.isChecked()) await this.rememberCard.click();
  }
}
