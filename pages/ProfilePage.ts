import { expect } from '@playwright/test';
import { BasePage, LOCALE_PATH } from './BasePage';

export class ProfilePage extends BasePage {
  readonly heading = this.page.getByRole('heading', { name: 'حسابك' });
  readonly firstNameInput = this.page.getByRole('textbox', { name: 'الاسم الأول' });
  readonly lastNameInput = this.page.getByRole('textbox', { name: 'اسم العائلة' });
  readonly saveButton = this.page.getByRole('button', { name: 'تحديث حسابك' });

  // The account area has its own header (no main-site search box), so it gets its own ready check.
  async openProfile() {
    await this.page.goto(`${LOCALE_PATH}/account/profile/`, { waitUntil: 'domcontentloaded' });
    await expect(this.heading).toBeVisible({ timeout: 60_000 });
    await expect(this.firstNameInput).toBeEditable();
  }

  async updateName(firstName: string, lastName: string) {
    // Typing before the form hydrates is wiped on hydration, so retry until the save button wakes up.
    await expect(async () => {
      await this.firstNameInput.fill(firstName);
      await this.lastNameInput.fill(lastName);
      await expect(this.saveButton).toBeEnabled({ timeout: 3_000 });
    }).toPass({ timeout: 30_000 });
    await this.saveButton.click();
    await expect(this.saveButton).toBeDisabled();
  }

  async expectName(firstName: string, lastName: string) {
    await this.openProfile();
    await expect(this.firstNameInput).toHaveValue(firstName);
    await expect(this.lastNameInput).toHaveValue(lastName);
  }
}
