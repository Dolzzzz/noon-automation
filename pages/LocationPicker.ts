import { expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { Header } from './Header';

export class LocationPicker extends BasePage {
  private readonly header = new Header(this.page);
  private readonly portal = this.page.locator('#overlay-portal');
  readonly anyPanelTitle = this.portal.locator('[data-qa^="lbl_modalTitle_"]');
  readonly deliverToTitle = this.portal.locator('[data-qa="lbl_modalTitle_تسليم إلى"]');
  // Each saved address is a card whose <p> holds the address line.
  readonly savedAddressLines = this.portal.locator('p').filter({ hasText: /محافظة/ });

  // Only the guest-style "إضافة عنوان جديد" map has this button.
  readonly addAddressMap = this.portal.getByText('تأكيد الموقع', { exact: true });

  /**
   * Opens the "تسليم إلى" saved-address panel. A click that lands before the signed-in state has
   * loaded opens the guest "add new address" map instead, so the page settles before clicking,
   * and if the map still shows up the page is reloaded and given longer. Nothing on the map is used.
   */
  async openPicker() {
    await this.settle(5_000);
    await expect(async () => {
      if (await this.deliverToTitle.isVisible()) return;
      if ((await this.addAddressMap.isVisible()) || (await this.anyPanelTitle.isVisible())) {
        await this.page.reload({ waitUntil: 'domcontentloaded' });
        await this.waitForAppReady();
        await this.settle(8_000);
      }
      await this.header.locationButton.click({ timeout: 5_000 });
      await expect(this.deliverToTitle).toBeVisible({ timeout: 8_000 });
    }).toPass({ timeout: 120_000, intervals: [1_000] });
  }

  private async settle(ms: number) {
    await this.page.waitForLoadState('load');
    await this.page.waitForTimeout(ms);
  }

  async currentLocationText(): Promise<string> {
    return (await this.header.locationButton.innerText()).replace(/\s+/g, ' ').trim();
  }

  /** "33, 44, group 111-b11, …" → "33, 44": enough to tell saved addresses apart in the header. */
  static addressKey(line: string): string {
    return line.split(',').slice(0, 2).map(s => s.trim()).join(', ');
  }

  /** Picks the saved address already shown in the header (or the first one), leaving the location as it was. */
  async chooseCurrentAddress(current: string) {
    await expect(this.savedAddressLines.first()).toBeVisible();
    const lines = await this.savedAddressLines.allInnerTexts();
    const index = Math.max(0, lines.findIndex(line => current.includes(LocationPicker.addressKey(line))));
    await this.savedAddressLines.nth(index).click();
    await this.failIfPhoneVerificationAsked();
  }

  /** Picks the first saved address that is not the current one; returns its key. */
  async chooseDifferentAddress(current: string): Promise<string> {
    await expect(this.savedAddressLines.first()).toBeVisible();
    const lines = await this.savedAddressLines.allInnerTexts();
    const index = lines.findIndex(line => !current.includes(LocationPicker.addressKey(line)));
    if (index < 0) {
      throw new Error('Flow 06 needs a second saved address on the account, different from the current one.');
    }
    const key = LocationPicker.addressKey(lines[index]);
    await this.savedAddressLines.nth(index).click();
    await this.failIfPhoneVerificationAsked();
    return key;
  }
}
