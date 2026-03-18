import { Page, Locator } from "@playwright/test";

export class Logout {
  private readonly page: Page;
  private readonly profileMenu: Locator;
  private readonly appMenu: Locator;
  private readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.appMenu = page.locator('[data-qa="header-mobile-app-menu-button"]');
    this.profileMenu = page.locator('[data-qa="header-phone-profile-button"]');
    this.logoutButton = page.locator('[data-qa="profile-menu-button-logoff"]');
  }
  async logout() {
    await this.appMenu.click();
    await this.profileMenu.click();
    await this.logoutButton.click();
    this.page.on("dialog", async (dialog) => {
      await dialog.accept();
    });
    await this.page.waitForTimeout(9000);
    if (!this.page.url().includes("logout")) {
      console.log(
        "Logout failed, retrying...",
        this.page.url().includes("logout"),
        this.page.url(),
      );
      await this.appMenu.click();
      await this.profileMenu.click();
      await this.logoutButton.click();
      this.page.on("dialog", async (dialog) => {
        await dialog.accept();
      });
    }
    await this.page.waitForLoadState();
  }
}
