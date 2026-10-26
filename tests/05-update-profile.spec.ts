import { test } from '../fixtures/test';
import { uniqueProfileName } from '../test-data/data';

test('05 · update the profile details', async ({ profilePage }) => {
  const { firstName, lastName } = uniqueProfileName();

  await test.step('open the profile page', async () => {
    await profilePage.openProfile();
  });

  await test.step(`change the name to "${firstName} ${lastName}" and save`, async () => {
    await profilePage.updateName(firstName, lastName);
  });

  await test.step('new name is kept after a reload', async () => {
    await profilePage.expectName(firstName, lastName);
  });
});
