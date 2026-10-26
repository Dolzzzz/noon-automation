import { test, expect } from '../fixtures/test';

test('06 · update the delivery location', async ({ header, locationPicker }) => {
  let before = '';
  let chosen = '';

  await test.step('open the "deliver to" picker from the header', async () => {
    await header.open('/');
    before = await locationPicker.currentLocationText();
    await locationPicker.openPicker();
  });

  await test.step('choose a different saved address', async () => {
    chosen = await locationPicker.chooseDifferentAddress(before);
  });

  await test.step('header now shows the new delivery address', async () => {
    await expect(header.locationButton).toContainText(chosen);
  });
});
