import { expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { Header } from './Header';

export class LocationPicker extends BasePage {
  private readonly header = new Header(this.page);
  // The "deliver to" panel is a portal without a dialog role, so it is found by its title.
  readonly panel = this.page.locator('#overlay-portal').filter({ hasText: 'تسليم إلى' });
  readonly title = this.panel.getByText('تسليم إلى', { exact: true });
  readonly savedAddressLines = this.panel.getByText(/محافظة/);

  async openPicker() {
    await this.clickUntilVisible(this.header.locationButton, this.title);
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
