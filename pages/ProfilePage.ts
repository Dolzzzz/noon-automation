import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProfilePage extends BasePage {
  readonly firstNameInput = this.page.locator('input[name="firstName"], input[name="first_name"]').first();
  readonly lastNameInput = this.page.locator('input[name="lastName"], input[name="last_name"]').first();
  readonly saveButton = this.page.getByRole('button', { name: /حفظ|تحديث|Save|Update/i }).first();

  async openProfile() {
    await this.open('/account/profile/');
  }

  async updateName(firstName: string, lastName: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.saveButton.click();
  }

  async expectName(firstName: string, lastName: string) {
    await this.page.reload();
    await this.waitForAppReady();
    await expect(this.firstNameInput).toHaveValue(firstName);
    await expect(this.lastNameInput).toHaveValue(lastName);
  }
}
