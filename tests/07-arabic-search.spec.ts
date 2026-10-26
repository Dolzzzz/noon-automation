import { test, expect } from '../fixtures/test';
import { arabicSearchTerm } from '../test-data/data';

test('07 · search using an Arabic term', async ({ page, header, searchResults }) => {
  await test.step('open the home page', async () => {
    await header.open('/');
  });

  await test.step(`search for "${arabicSearchTerm}"`, async () => {
    await header.search(arabicSearchTerm);
  });

  await test.step('results page is for the Arabic term and lists products', async () => {
    expect(decodeURIComponent(page.url())).toContain(`q=${arabicSearchTerm}`);
    await expect(searchResults.productBoxes.first()).toBeVisible();
    expect(await searchResults.productBoxes.count()).toBeGreaterThan(0);
  });
});
