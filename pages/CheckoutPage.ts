import { expect, type Frame, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

type CardField = 'number' | 'expiry' | 'cvv' | 'name';

// Payment fields are usually hosted in a payment-provider iframe, so each one is
// looked up in the page and in every frame, by the attributes card forms commonly use.
const FIELD_SELECTORS: Record<CardField, string> = {
  number: 'input[autocomplete="cc-number"], input[name*="cardnumber" i], input[name*="card_number" i], input[id*="card-number" i], input[placeholder*="رقم البطاقة"], input[placeholder*="card number" i]',
  expiry: 'input[autocomplete="cc-exp"], input[name*="expiry" i], input[name*="exp" i], input[placeholder*="MM" i], input[placeholder*="تاريخ"]',
  cvv: 'input[autocomplete="cc-csc"], input[name*="cvv" i], input[name*="cvc" i], input[name*="csc" i], input[placeholder*="CVV" i]',
  name: 'input[autocomplete="cc-name"], input[name*="holder" i], input[name*="name" i], input[placeholder*="الاسم"], input[placeholder*="name" i]',
};

export class CheckoutPage extends BasePage {
  readonly cardPaymentOption = this.page.getByText(/بطاقة ائتمان|بطاقة الخصم|Credit|Debit card/i).first();
  readonly addNewCardButton = this.page.getByText(/إضافة بطاقة جديدة|أضف بطاقة جديدة|Add new card|Add a new card/i).first();

  async selectCardPayment() {
    await expect(this.cardPaymentOption).toBeVisible({ timeout: 60_000 });
    await this.cardPaymentOption.click();
  }

  async openNewCardForm() {
    if (await this.addNewCardButton.isVisible()) await this.addNewCardButton.click();
  }

  private async findField(field: CardField): Promise<Locator> {
    let found: Locator | undefined;
    await expect(async () => {
      for (const frame of [this.page.mainFrame(), ...this.page.frames()] as Frame[]) {
        const candidate = frame.locator(FIELD_SELECTORS[field]).first();
        if (await candidate.isVisible().catch(() => false)) {
          found = candidate;
          return;
        }
      }
      throw new Error(`Card ${field} field not visible yet`);
    }).toPass({ timeout: 45_000 });
    return found!;
  }

  /** Types the dummy card into the new-card form. Deliberately does not save the card or pay. */
  async fillCardDetails(card: { number: string; expiryMonth: string; expiryYear: string; cvv: string; holderName: string }) {
    const number = await this.findField('number');
    await number.pressSequentially(card.number, { delay: 40 });
    const expiry = await this.findField('expiry');
    await expiry.pressSequentially(`${card.expiryMonth}${card.expiryYear}`, { delay: 40 });
    const cvv = await this.findField('cvv');
    await cvv.pressSequentially(card.cvv, { delay: 40 });
    const name = await this.findField('name').catch(() => undefined);
    if (name) await name.fill(card.holderName);
    return { number, expiry, cvv, name };
  }
}
