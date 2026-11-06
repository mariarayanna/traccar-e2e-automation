import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('input[type="email"], input[name="email"]');
    this.passwordInput = page.locator('input[type="password"], input[name="password"]');
    this.submitButton = page.locator('button[type="submit"]');
  }

  async navigate() {
    await this.page.goto('/login');
    await this.emailInput.waitFor({ state: 'visible' });
  }

  async login(email: string, pass: string) {
    await this.emailInput.click();
    await this.emailInput.clear();
    await this.emailInput.pressSequentially(email, { delay: 30 });

    await this.passwordInput.click();
    await this.passwordInput.clear();
    await this.passwordInput.pressSequentially(pass, { delay: 30 });

    await this.submitButton.click();
  }
}