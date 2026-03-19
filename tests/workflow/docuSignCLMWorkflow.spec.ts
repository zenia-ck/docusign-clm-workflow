import "dotenv/config";
import { faker } from "@faker-js/faker";
import { chromium } from "@playwright/test";
import { test, expect, Page, BrowserContext } from "@playwright/test";
import { LoginPage } from "../../utils/login/login";
import { AssignTaskPage } from "../../pages/tasks/assignTask.page";
import { TroubleshootNDAPage } from "../../pages/tasks/troubleshootNDAForm.page";
import { TroubleShootActivityNDAPage } from "../../pages/tasks/troubleshootActivityNda.page";
import { TasksPage } from "../../pages/tasks/tasks.page";
import { Logout } from "../../utils/logout/logout";
import { GmailLoginPage } from "../../pages/gmail/gmailLogin.page";
import { DocuSignPage } from "../../pages/docusign/docusign.page";

test.describe.serial("DocuSign CLM Workflow Automation", () => {
  let page: Page;
  let context: BrowserContext;
  let loginPage: LoginPage;
  let assignTaskPage: AssignTaskPage;
  let tasksPage: TasksPage;
  let gmailLoginPage: GmailLoginPage;
  let assignedEmail: string | null;
  let assignedEmailForRouting: string | null;

  const userName = faker.person.fullName();

  test.beforeAll(async () => {
    context = await chromium.launchPersistentContext("data/gmail-user-data", {
      headless: false,
      channel: "chrome",
      permissions: ["geolocation"],

      args: ["--disable-blink-features=AutomationControlled"],
    });
    page = context.pages()[0];

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
    assignedEmail = await troubleshootActivityNDAPage.getTheAssignedEmail();
    await newPage.close();
    await parentPage.bringToFront();
  });

  test("Logout from the qa user for viewing the task from assigned user", async () => {
    const logout = new Logout(page);
    await logout.logout();
  });

  test("Login with the assigned user to check the task", async () => {
    loginPage = new LoginPage(page);
    await loginPage.login(assignedEmail!, process.env.DOCUSIGN_QA_PASSWORD!);
  });

  test("Go to tasks page and change the status to 'Send to Business manager'", async () => {
    tasksPage = new TasksPage(page);
    await tasksPage.goToTasksPage();
    await tasksPage.matchInfoAndSendToBusinessManager(userName);
  });

  test("Logout from the assigned user to check the routing email", async () => {
    const logout = new Logout(page);
    await logout.logout();
  });

  test("Login with the QA user to check the next user", async () => {
    loginPage = new LoginPage(page);
    await loginPage.login(
      process.env.DOCUSIGN_QA_USERNAME!,
      process.env.DOCUSIGN_QA_PASSWORD!,
    );
  });

  test("View the workflow and get the routing user", async () => {
    assignTaskPage = new AssignTaskPage(page);
    const parentPage = page;
    const newPage = await assignTaskPage.viewTheWorkFlow(userName);
    const troubleshootActivityNDAPage = new TroubleShootActivityNDAPage(
      newPage,
    );
    assignedEmailForRouting =
      await troubleshootActivityNDAPage.getTheAssignedEmailForRouting();
    await newPage.close();
    await parentPage.bringToFront();
  });

  test("Logout from the qa user to change the status to approved", async () => {
    const logout = new Logout(page);
    await logout.logout();
  });

  test("Login with the next assigned user to change the status to approved", async () => {
    loginPage = new LoginPage(page);
    await loginPage.login(
      assignedEmailForRouting!,
      process.env.DOCUSIGN_QA_PASSWORD!,
    );
  });

  test("Go to tasks page and change the status to 'Approved'", async () => {
    tasksPage = new TasksPage(page);
    await tasksPage.goToTasksPage();
    await tasksPage.matchInfoAndApprove(userName);
  });

  test("Logout from the assigned user to check the next status", async () => {
    const logout = new Logout(page);
    await logout.logout();
  });

  test("Login with the QA user to check the next status as sent for signature", async () => {
    loginPage = new LoginPage(page);
    await loginPage.login(
      process.env.DOCUSIGN_QA_USERNAME!,
      process.env.DOCUSIGN_QA_PASSWORD!,
    );
  });

  test("View the workflow and get the assigned user and send for signature", async () => {
    assignTaskPage = new AssignTaskPage(page);
    const parentPage = page;
    const newPage = await assignTaskPage.viewTheWorkFlow(userName);
    const troubleshootActivityNDAPage = new TroubleShootActivityNDAPage(
      newPage,
    );
    await troubleshootActivityNDAPage.verifyTheStatusAsSentForSignature();
    await newPage.close();
    await parentPage.bringToFront();
  });

  test("Logout from the assigned user to check the next status as completed", async () => {
    const logout = new Logout(page);
    await logout.logout();
  });

  test("Login to gmail and sign the document", async () => {
    gmailLoginPage = new GmailLoginPage(page);
    await page.goto("https://mail.google.com/");
    const parentPage = page;
    const newPage = await gmailLoginPage.loginToGmailAndReviewDoc();
    const docuSignPage = new DocuSignPage(newPage);
    await context.grantPermissions(["geolocation"]);
    await docuSignPage.signTheDocument();
    await newPage.close();
    await parentPage.bringToFront();
  });

  test("Login with the QA user to check the next status as completed", async () => {
    await page.goto("https://account-d.docusign.com");
    loginPage = new LoginPage(page);
    await loginPage.login(
      process.env.DOCUSIGN_QA_USERNAME!,
      process.env.DOCUSIGN_QA_PASSWORD!,
    );
  });

  test("View the workflow and check the status as completed", async () => {
    assignTaskPage = new AssignTaskPage(page);
    await assignTaskPage.checkWorkflowStatusAsCompleted(userName);
  });

  test.afterAll(async () => {
    await context.close();
  });
});
