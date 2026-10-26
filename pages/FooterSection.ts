import type { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class FooterSection extends BasePage {
  socialLink(linkName: string) {
    return this.page.getByRole('link', { name: linkName });
  }

  /** Clicks a footer social icon and returns the tab it opens (or this tab if it navigates in place). */
  async openSocial(linkName: string): Promise<Page> {
    const link = this.socialLink(linkName);
    // The footer is lazy-rendered; keep scrolling until the icons exist.
    for (let i = 0; i < 15 && !(await link.isVisible()); i++) {
      await this.page.mouse.wheel(0, 4000);
      await this.page.waitForTimeout(800);
    }
    await link.scrollIntoViewIfNeeded();

    const opensNewTab = (await link.getAttribute('target')) === '_blank';
    if (!opensNewTab) {
      await link.click();
      return this.page;
    }
    const [popup] = await Promise.all([this.page.context().waitForEvent('page'), link.click()]);
    await popup.waitForLoadState('domcontentloaded');
    return popup;
  }
}
