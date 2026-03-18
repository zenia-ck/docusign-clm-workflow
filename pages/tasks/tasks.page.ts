import { Page, Locator } from "@playwright/test";

export class TasksPage {
  private readonly page: Page;
  private readonly appMenu: Locator;
  private readonly infoRows: Locator;
  private readonly nextStepSelectBox: Locator;
  private readonly completeButton: Locator;
  private readonly tasksMenu: Locator;
  private readonly routeTaskStatusNextSelectBox: Locator;
  private readonly myTasksHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.appMenu = page.locator('[data-qa="header-mobile-app-menu-button"]');
    this.infoRows = page.locator('[data-qa="task-column-information"]');
    this.nextStepSelectBox = page.locator('[data-qa="choice-task-select"]');
    this.completeButton = page.locator('[data-qa="task-complete-button"]');
    this.tasksMenu = page.locator('[data-qa="header-Tasks-tab-button"]');
    this.routeTaskStatusNextSelectBox = page.locator(
      '[data-qa="route-task-select"]',
    );
    this.myTasksHeading = page.locator('//span[text()="My Tasks"]');
  }

  async goToTasksPage(): Promise<void> {
    await this.appMenu.click();
    await this.tasksMenu.last().click();
    await this.page.waitForLoadState();
  }

  async matchInfoAndSendToBusinessManager(userName: string): Promise<void> {
    console.log(
      await this.infoRows.count(),
      "total rows",
      await this.infoRows.nth(0).textContent(),
      "TEXt",
    );
    for (let i = 0; i < (await this.infoRows.count()); i++) {
      const rowText = await this.infoRows.nth(i).textContent();
      if (rowText?.includes(userName)) {
        console.log("INSIDE IF");
        await this.infoRows.nth(i).click({ force: true });
        break;
      }
    }
    await this.nextStepSelectBox.selectOption("Send to Business Managers");
    await this.completeButton.click();
    await this.myTasksHeading.waitFor({
      state: "visible",
      timeout: 60000,
    });
    await this.page.waitForLoadState();
  }

  async matchInfoAndApprove(userName: string): Promise<void> {
    for (let i = 0; i < (await this.infoRows.count()); i++) {
      const rowText = await this.infoRows.nth(i).textContent();
      if (rowText?.includes(userName)) {
        await this.infoRows.nth(i).click();
        break;
      }
    }
    await this.routeTaskStatusNextSelectBox.selectOption("Approve");
    await this.completeButton.click();
    await this.myTasksHeading.waitFor({
      state: "visible",
      timeout: 60000,
    });
    await this.page.waitForLoadState();
  }
}
