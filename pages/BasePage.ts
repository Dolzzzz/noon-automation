import { expect, type Locator, type Page } from '@playwright/test';

export const LOCALE_PATH = '/egypt-ar';

export const PHONE_VERIFICATION_MESSAGE =
  'noon asked to confirm the mobile number on the delivery address ("تأكيد رقم الموبايل"). ' +
  'This needs a WhatsApp code, so do it once by hand: header location picker → "التحقق الآن" on each saved address. Then rerun.';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  async open(path = '/') {
    await this.page.goto(`${LOCALE_PATH}${path}`, { waitUntil: 'domcontentloaded' });
    await this.waitForAppReady();
    await this.ensureArabic();
  }

  /** noon can bounce to /egypt-en/ (e.g. a stray click on the header language toggle); switch back. */
  async ensureArabic() {
    if (!this.page.url().includes('/egypt-en/')) return;
    const toArabic = this.page.getByRole('banner').getByRole('button', { name: /العربية/ });
    await expect(async () => {
      await toArabic.click();
      await this.page.waitForURL(/\/egypt-ar\//, { timeout: 5_000 });
    }).toPass({ timeout: 60_000 });
    await this.waitForAppReady();
  }

  /** noon renders its header server-side and hydrates it later; wait for the search box at least. */
  async waitForAppReady() {
    await this.page.locator('[data-qa="header-search"]').first().waitFor({ state: 'visible', timeout: 60_000 });
  }

  /**
   * Clicks `trigger` until `expected` appears. noon silently drops clicks that land before
   * React has hydrated the element, so a single click is not reliable on a fresh page.
   */
  protected async clickUntilVisible(trigger: Locator, expected: Locator, timeout = 60_000) {
    await expect(async () => {
      if (!(await expected.isVisible())) await trigger.click();
      await expect(expected).toBeVisible({ timeout: 5_000 });
    }).toPass({ timeout, intervals: [1_000, 2_000, 3_000] });
  }

  /** Using an address whose phone noon has not verified opens an OTP prompt the suite cannot answer. */
  protected async failIfPhoneVerificationAsked(timeout = 3_000) {
    const prompt = this.page.getByText('تأكيد رقم الموبايل');
    const asked = await prompt.waitFor({ state: 'visible', timeout }).then(() => true, () => false);
    if (asked) throw new Error(PHONE_VERIFICATION_MESSAGE);
  }

  /** Product SKU from a noon product URL, e.g. /…/N53409767A/p/ → N53409767A. */
  static skuFromUrl(url: string): string {
    const match = url.match(/\/([A-Z0-9]+)\/p\/?/i);
    if (!match) throw new Error(`No SKU in product URL: ${url}`);
    return match[1];
  }
}
