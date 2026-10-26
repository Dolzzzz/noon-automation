import { test, expect } from '../fixtures/test';

test('06 · update the delivery location', async ({ header, locationPicker }) => {
  let before = '';

  await test.step('open the location picker from the header', async () => {
    await header.open('/');
    before = await locationPicker.currentLocationText();
    await locationPicker.openPicker();
  });

  await test.step('choose a different delivery location', async () => {
    await locationPicker.chooseDifferentLocation(before);
  });

  await test.step('header shows the new location', async () => {
    await expect.poll(() => locationPicker.currentLocationText()).not.toBe(before);
  });
});
