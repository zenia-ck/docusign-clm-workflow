import { Page, Locator } from "@playwright/test";

export class LoginPage {
  private readonly page: Page;
  private readonly username: Locator;
  private readonly nextButton: Locator;
  private readonly password: Locator;
  private readonly loginButton: Locator;
  private readonly pageLogo: Locator;

  constructor(page: Page) {
    this.page = page;
    this.username = page.locator("[data-qa='username']");
    this.nextButton = page.locator("[data-qa='submit-username']");
    this.password = page.locator('[data-qa="password"]');
    this.loginButton = page.locator("[data-qa='submit-password']");
    this.pageLogo = page.locator('[data-qa="header-docusign-logo"]');
  }

  async login(username: string, password: string) {
    await this.page.waitForLoadState();
    await this.username.fill(username);
    await this.nextButton.click();
    await this.password.fill(password);
    await this.loginButton.click();
    await this.page.waitForTimeout(3000);
  }
}
