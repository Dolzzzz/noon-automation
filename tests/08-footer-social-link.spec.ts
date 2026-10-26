import { test, expect } from '../fixtures/test';
import { socialNetwork } from '../test-data/data';

test('08 · open a social media link from the footer', async ({ header, footer }) => {
  await test.step('open the home page', async () => {
    await header.open('/');
  });

  const social = await test.step('scroll to the footer and click the Facebook icon', async () => {
    return footer.openSocial(socialNetwork.linkName);
  });

  await test.step('noon\'s Facebook page opens', async () => {
    await expect(social).toHaveURL(socialNetwork.expectedHost);
    await social.waitForTimeout(2_000);
  });
});
