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

  /**
   * Opens the "تسليم إلى" panel. Never clicks the header while a panel is already up: a click
   * replayed after hydration can open it late, and a second click would land inside it.
   */
  async openPicker() {
    await expect(async () => {
      if (await this.deliverToTitle.isVisible()) return;
      if (await this.anyPanelTitle.isVisible()) {
        // Some other panel (e.g. the add-address map) is up: start over from a clean page.
        await this.page.reload({ waitUntil: 'domcontentloaded' });
        await this.waitForAppReady();
      }
      await this.header.locationButton.click({ timeout: 5_000 });
      await expect(this.deliverToTitle).toBeVisible({ timeout: 5_000 });
    }).toPass({ timeout: 60_000, intervals: [1_000, 2_000, 3_000] });
  }

  async currentLocationText(): Promise<string> {
    return (await this.header.locationButton.innerText()).replace(/\s+/g, ' ').trim();
  }

  /** "33, 44, group 111-b11, …" → "33, 44": enough to tell saved addresses apart in the header. */
  static addressKey(line: string): string {
    return line.split(',').slice(0, 2).map(s => s.trim()).join(', ');
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
