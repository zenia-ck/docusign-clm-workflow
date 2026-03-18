import "dotenv/config";
import { faker } from "@faker-js/faker";
import { test, expect, Page, BrowserContext } from "@playwright/test";
import { LoginPage } from "../../pages/login/login.page";
import { AssignTaskPage } from "../../pages/tasks/assignTask.page";
import { TroubleshootNDAPage } from "../../pages/tasks/troubleshootNDAForm.page";
import { TroubleShootActivityNDAPage } from "../../pages/tasks/troubleshootActivityNda.page";
test.describe.serial("DocuSign CLM Workflow Automation", () => {
  let page: Page;
  let context: BrowserContext;
  let loginPage: LoginPage;
  let assignTaskPage: AssignTaskPage;
  const userName = faker.person.fullName();

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();

    loginPage = new LoginPage(page);

    await page.goto("https://account-d.docusign.com");

    await loginPage.login(
      process.env.DOCUSIGN_QA_USERNAME!,
      process.env.DOCUSIGN_QA_PASSWORD!,
    );
  });

  test("Take actions and fill the form", async () => {
    assignTaskPage = new AssignTaskPage(page);
    const parentPage = page;
    const newPage = await assignTaskPage.assignTask();
    const troubleshootPage = new TroubleshootNDAPage(newPage);
    page = await troubleshootPage.fillNDAForm(parentPage, userName);
    await page.bringToFront();
    await page.waitForLoadState();
  });

  test("View the workflow and get the assigned user", async () => {
    assignTaskPage = new AssignTaskPage(page);
    const parentPage = page;
    const newPage = await assignTaskPage.viewTheWorkFlow(userName);
    const troubleshootActivityNDAPage = new TroubleShootActivityNDAPage(
      newPage,
    );
    const assignedEmail =
      await troubleshootActivityNDAPage.getTheAssignedEmail();
    console.log("Assigned Email:", assignedEmail);
    await newPage.close();
    await parentPage.bringToFront();
    await assignTaskPage.logout();
  });

  test("Login with the assigned user", async () => {
    loginPage = new LoginPage(page);
    await loginPage.login(
      process.env.DOCUSIGN_ASSIGNED_EMAIL!,
      process.env.DOCUSIGN_QA_PASSWORD!,
    );
  });

  test.afterAll(async () => {
    await context.close();
  });
});
