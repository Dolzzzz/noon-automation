import { test } from '../fixtures/test';
import { credentials } from '../utils/env';

const AUTH_FILE = '.auth/user.json';

test('01 · sign in with email and password', async ({ page, header, loginPage }) => {
  await test.step('open noon Egypt (Arabic)', async () => {
    await header.open('/');
  });

  await test.step('sign in with the test account', async () => {
    await loginPage.signIn(credentials.email, credentials.password);
  });

  await test.step('signed-in header is shown', async () => {
    await loginPage.expectSignedIn();
  });

  // Every later flow starts from this signed-in session.
  await page.context().storageState({ path: AUTH_FILE });
});
