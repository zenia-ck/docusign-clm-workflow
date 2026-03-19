import { Page, Locator, expect } from "@playwright/test";

export class AssignTaskPage {
  private readonly page: Page;
  private readonly appSwitchBtn: Locator;
  private readonly appMenu: Locator;
  private readonly clmBtn: Locator;
  private readonly welcomePopupText: Locator;
  private readonly introductionText: Locator;
  private readonly crossBtn: Locator;
  private readonly takeActionsButton: Locator;
  private readonly troubleshootNDAButton: Locator;
  private readonly adminMenu: Locator;
  private readonly workflowBtn: Locator;
  private readonly infoRows: Locator;
  private readonly applyBtn: Locator;
  private readonly taskLink: Locator;
  private readonly statusRows: Locator;

  constructor(page: Page) {
    this.page = page;
    this.appSwitchBtn = page.locator('[data-qa="header-app-menu-button"]');
    this.clmBtn = page.locator('[data-qa="CLM-launch-button"]');
    this.welcomePopupText = page.locator(
      '//div[text()="Welcome to Docusign CLM"]',
    );
    this.introductionText = page.locator(
      '//div[text()="Introducing Workflow Templates"]',
    );
    this.crossBtn = page.locator('[ng-click="ctrl.close()"]');
    this.takeActionsButton = page.locator(
      '[data-qa="header-ActionsMenuName-tab-button-content"]',
    );
    this.troubleshootNDAButton = page.locator(
      '//span[text()="Troubleshoot NDA"]',
    );
    this.appMenu = page.locator('[data-qa="header-mobile-app-menu-button"]');
    this.adminMenu = page.locator('[data-qa="header-Admin-tab-button"]');
    this.workflowBtn = page.locator('//span[text()="Workflows"]');
    this.infoRows = page.locator('[name="information"] > div');
    this.statusRows = page.locator('[name="status"] > div');
    this.applyBtn = page.locator('//button[text()="Apply"]');
    this.taskLink = page.locator('[title="Troubleshooting Activity_NDA"]');
  }

  async handleNewTabPopups(page: Page): Promise<void> {
    console.log(
      await this.introductionText.isVisible(),
      await this.welcomePopupText.isVisible(),
      "VALUES",
    );
    if (
      (await this.introductionText.isVisible()) ||
      (await this.welcomePopupText.isVisible())
    )
      await this.crossBtn.first().click();
  }

  async assignTask(): Promise<Page> {
    await this.page.waitForLoadState();
    await this.appSwitchBtn.click({ force: true });
    await this.clmBtn.click();
    await this.page.waitForLoadState();
    await this.page.waitForTimeout(4000);
    await this.handleNewTabPopups(this.page);
    await this.appMenu.click();
    await this.takeActionsButton.click();
    await this.handleNewTabPopups(this.page);
    await this.troubleshootNDAButton.click();
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent("page"),
    ]);
    await newPage.waitForLoadState();
    return newPage;
  }

  async viewTheWorkFlow(userName: string): Promise<Page> {
    await this.appMenu.click();
    await this.adminMenu.last().click();
    await this.page.waitForLoadState();
    await this.page.waitForTimeout(4000);
    await this.handleNewTabPopups(this.page);
    await this.workflowBtn.click();
    await this.page.waitForLoadState();
    await this.applyBtn.click();
    await this.page.waitForLoadState();
    await this.page.waitForTimeout(4000);

    for (let i = 0; i < (await this.infoRows.count()); i++) {
      const rowText = await this.infoRows.nth(i).textContent();
      if (rowText?.includes(userName)) {
        await this.taskLink.nth(i).click();
        break;
      }
    }
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent("page"),
    ]);
    await newPage.waitForLoadState();
    return newPage;
  }

  async checkWorkflowStatusAsCompleted(userName: string): Promise<void> {
    await this.page.waitForLoadState();
    await this.appSwitchBtn.click({ force: true });
    await this.clmBtn.click();
    await this.page.waitForLoadState();
    await this.handleNewTabPopups(this.page);
    await this.appMenu.click();
    await this.adminMenu.last().click();
    await this.page.waitForLoadState();
    await this.handleNewTabPopups(this.page);
    await this.workflowBtn.click();
    await this.page.waitForLoadState();
    await this.applyBtn.click();
    await this.page.waitForLoadState();
    await this.page.waitForTimeout(4000);

    for (let i = 0; i < (await this.infoRows.count()); i++) {
      const rowText = await this.infoRows.nth(i).textContent();
      if (rowText?.includes(userName)) {
        await expect(this.statusRows.nth(i)).toContainText("Completed");
        break;
      }
    }
  }
}
