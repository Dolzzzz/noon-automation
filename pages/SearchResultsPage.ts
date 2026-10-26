import { BasePage } from './BasePage';

export class SearchResultsPage extends BasePage {
  readonly productBoxes = this.page.locator('[data-qa="plp-product-box"]');
  readonly productNames = this.page.locator('[data-qa="plp-product-box-name"]');
  readonly searchHeader = this.page.locator('[data-qa="searchHeader"]');

  async openSearch(term: string) {
    await this.open(`/search/?q=${encodeURIComponent(term)}`);
  }

  /** Opens the first product in the results and returns its URL. */
  async openFirstProduct(): Promise<string> {
    const link = this.page.locator('a[href*="/p/"]:has([data-qa^="productImagePLP"])').first();
    await link.waitFor();
    await link.click();
    await this.page.waitForURL(/\/p\//);
    return this.page.url();
  }
}
