import "dotenv/config";
import { test, expect, Page, BrowserContext } from "@playwright/test";
import { LoginPage } from "../../pages/login/login.page";
import { DashboardPage } from "../../pages/dashboard/dashboard.page";
import { WorkflowPage } from "../../pages/workflow/workflow.page";

test.describe.serial("Check svg locator", () => {
  let page: Page;
  let context: BrowserContext;
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;
  let workflowPage: WorkflowPage;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();

    loginPage = new LoginPage(page);

    await page.goto("https://account-d.docusign.com");

    await loginPage.login(
      process.env.DOCUSIGN_USERNAME!,
      process.env.DOCUSIGN_PASSWORD!,
    );
  });

  test("Go to Dashboard", async () => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.viewTheWorkFlow();
  });

  test("Check last step in workflow", async () => {
    workflowPage = new WorkflowPage(page);
    await workflowPage.checkLastStep();
  });

  test.afterAll(async () => {
    await context.close();
  });
});
