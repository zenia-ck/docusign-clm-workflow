import { Page, Locator } from "@playwright/test";
// import { WorkflowPage } from "../workflow/workflow.page";

export class DashboardPage {
  private readonly page: Page;
  private readonly appChoiceBtn: Locator;
  private readonly clmBtn: Locator;
  private readonly crossBtn: Locator;
  private readonly appMenu: Locator;
  private readonly adminMenu: Locator;

  constructor(page: Page) {
    this.page = page;
    this.appChoiceBtn = page.locator('[data-qa="header-app-menu-button"]');
    this.clmBtn = page.locator('[data-qa="CLM-launch-button"]');
    this.crossBtn = page.locator('[ng-click="ctrl.close()"]');
    this.appMenu = page.locator('[data-qa="header-mobile-app-menu-button"]');
    this.adminMenu = page.locator('[data-qa="header-Admin-tab-button"]');
  }

  async viewTheWorkFlow(): Promise<void> {
    await this.appChoiceBtn.click();
    await this.clmBtn.click();
    await this.crossBtn.click();
    const welcomeText = this.page.getByText("Welcome to Docusign CLM");
    await welcomeText.waitFor({ state: "visible" });
    if (await welcomeText.isVisible()) {
      console.log(true);
    }
    await this.appMenu.click();
    await this.adminMenu.last().click();
    await this.page.waitForTimeout(3000);
    const introText = this.page.getByText("Introducing Workflow Templates");

    await introText.waitFor({ state: "visible" });

    if (await introText.isVisible()) {
      console.log(true);
      await this.crossBtn.first().click();
    }
  }
}
