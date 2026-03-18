import { Page, Locator } from "@playwright/test";

export class AssignTaskPage {
  private readonly page: Page;
  private readonly appSwitchBtn: Locator;
  private readonly appChoiceBtn: Locator;
  private readonly clmBtn: Locator;
  private readonly crossBtn: Locator;
  private readonly takeActionsButton: Locator;
  private readonly troubleshootNDAButton: Locator;
  private readonly appMenu: Locator;
  private readonly adminMenu: Locator;
  private readonly workflowBtn: Locator;
  private readonly infoRows: Locator;
  private readonly applyBtn: Locator;
  private readonly taskLink: Locator;
  private readonly profileMenu: Locator;
  private readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.appSwitchBtn = page.locator('[data-qa="header-app-menu-button"]');
    this.clmBtn = page.locator('[data-qa="CLM-launch-button"]');
    this.crossBtn = page.locator('[ng-click="ctrl.close()"]');
    this.takeActionsButton = page.locator(
      '[data-qa="header-ActionsMenuName-tab-button-content"]',
    );
    this.appChoiceBtn = page.locator(
      '[data-qa="header-mobile-app-menu-button"]',
    );
    this.troubleshootNDAButton = page.locator(
      '//span[text()="Troubleshoot NDA"]',
    );
    this.appMenu = page.locator('[data-qa="header-mobile-app-menu-button"]');
    this.adminMenu = page.locator('[data-qa="header-Admin-tab-button"]');
    this.workflowBtn = page.locator('//span[text()="Workflows"]');
    this.infoRows = page.locator('[name="information"] > div');
    this.applyBtn = page.locator('//button[text()="Apply"]');
    this.taskLink = page.locator('[title="Troubleshooting Activity_NDA"]');
    this.profileMenu = page.locator('[data-qa="header-phone-profile-button"]');
    this.logoutButton = page.locator('[data-qa="profile-menu-button-logoff"]');
  }

  async assignTask(): Promise<Page> {
    await this.page.waitForLoadState();
    await this.appSwitchBtn.click();
    await this.clmBtn.click();
    await this.page.waitForLoadState();
    const welcomeText = this.page.getByText("Welcome to Docusign CLM");
    await welcomeText.waitFor({ state: "visible" });
    if (await welcomeText.isVisible()) {
      await this.crossBtn.click();
    }
    await this.appChoiceBtn.click();
    await this.takeActionsButton.click();
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
    const introText = this.page.getByText("Introducing Workflow Templates");
    await introText.waitFor({ state: "visible" });
    if (await introText.isVisible()) {
      await this.crossBtn.first().click();
    }
    await this.workflowBtn.click();
    await this.page.waitForLoadState();
    await this.applyBtn.click();
    await this.page.waitForLoadState();
    await this.page.waitForTimeout(4000);

    for (let i = 0; i < (await this.infoRows.count()); i++) {
      const rowText = await this.infoRows.nth(i).textContent();
      console.log(rowText, "NAME OF ROWS", userName);
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

  async logout() {
    await this.appMenu.click();
    await this.profileMenu.click();
    await this.logoutButton.click();
    this.page.on("dialog", async (dialog) => {
      await dialog.accept();
    });
    await this.appMenu.click();
    await this.profileMenu.click();
    await this.logoutButton.click();
    this.page.on("dialog", async (dialog) => {
      await dialog.accept();
    });
    await this.page.waitForLoadState();
  }
}
