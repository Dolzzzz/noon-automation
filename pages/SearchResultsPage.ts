import { BasePage } from './BasePage';

export class SearchResultsPage extends BasePage {
  readonly productBoxes = this.page.locator('[data-qa="plp-product-box"]');
  readonly productNames = this.page.locator('[data-qa="plp-product-box-name"]');
  readonly searchHeader = this.page.locator('[data-qa="searchHeader"]');
  readonly productLinks = this.page.locator('a[href*="/p/"]:has([data-qa^="productImagePLP"])');

  async openSearch(term: string) {
    await this.open(`/search/?q=${encodeURIComponent(term)}`);
  }

  /**
   * Opens the first product in the results and returns its URL. It follows the card's link
   * rather than clicking it: a click on a card can land on the sticky header (e.g. the
   * language toggle) while the grid is still shifting.
   */
  async openFirstProduct(): Promise<string> {
    const link = this.productLinks.first();
    await link.waitFor();
    const href = await link.getAttribute('href');
    if (!href) throw new Error('First search result has no product link');
    await this.page.goto(href, { waitUntil: 'domcontentloaded' });
    await this.waitForAppReady();
    await this.ensureArabic();
    return this.page.url();
  }
}
