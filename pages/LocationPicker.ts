import { expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { Header } from './Header';

export class LocationPicker extends BasePage {
  private readonly header = new Header(this.page);
  readonly panel = this.page.getByRole('dialog').first();

  async openPicker() {
    await this.clickUntilVisible(this.header.locationButton, this.panel);
  }

  async currentLocationText(): Promise<string> {
    return (await this.header.locationButton.innerText()).replace(/\s+/g, ' ').trim();
  }

  /** Picks the first saved address / area that is not the current one, and confirms it. */
  async chooseDifferentLocation(current: string): Promise<string> {
    const options = this.panel.locator('[role="radio"], label, li').filter({ hasNotText: current });
    const choice = options.first();
    const label = (await choice.innerText()).replace(/\s+/g, ' ').trim();
    await choice.click();
    const confirm = this.panel.getByRole('button', { name: /تأكيد|حفظ|توصيل هنا|Confirm|Save|Deliver here/i }).first();
    if (await confirm.isVisible()) await confirm.click();
    await expect(this.panel).toBeHidden();
    return label;
  }
}
