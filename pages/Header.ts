import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class Header extends BasePage {
  readonly banner = this.page.getByRole('banner');
  readonly searchBox = this.banner.getByRole('combobox');
  readonly signInButton = this.page.locator('[data-qa="btn_header_signInOrUp-header-desktop"]');
  readonly locationButton = this.banner.getByRole('button', { name: /location pin/ });
  readonly wishlistLink = this.page.locator('[data-qa="btn_wishlistLink-Header-Desktop"]');
  readonly cartLink = this.page.locator('[data-qa="btn_cartLink-Header-Desktop"]');

  async search(term: string) {
    // An Enter pressed before the search box hydrates is ignored, so retry until the results page loads.
    await expect(async () => {
      await this.searchBox.click();
      await this.searchBox.fill(term);
      await this.searchBox.press('Enter');
      await this.page.waitForURL(/\/search\/\?q=/, { timeout: 5_000 });
    }).toPass({ timeout: 60_000, intervals: [1_000, 2_000] });
  }
}
