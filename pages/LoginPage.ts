import { expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { Header } from './Header';

export class LoginPage extends BasePage {
  private readonly header = new Header(this.page);
  readonly dialog = this.page.getByRole('dialog').or(this.page.locator('[class*="modal" i]:has(input)')).first();
  readonly identifierInput = this.page.getByPlaceholder(/البريد الإلكتروني|email/i).first();
  readonly continueButton = this.page.getByRole('button', { name: /متابعة|Continue/ }).first();
  readonly passwordInput = this.page.locator('input[type="password"]').first();
  readonly submitButton = this.page.getByRole('button', { name: /^(تسجيل الدخول|Sign in|Log in)$/i }).last();

  async openSignInDialog() {
    await this.clickUntilVisible(this.header.signInButton, this.identifierInput);
  }

  async signIn(email: string, password: string) {
    await this.openSignInDialog();
    await this.identifierInput.fill(email);
    await this.continueButton.click();
    await expect(this.passwordInput).toBeVisible();
    // fill() types into a type=password field, so the value never shows on screen or in the video.
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async expectSignedIn() {
    await expect(this.passwordInput).toBeHidden();
    await expect(this.header.signInButton).toBeHidden({ timeout: 30_000 });
  }
}
