import { Page, Locator } from "@playwright/test";

export class GmailLoginPage {
  private readonly page: Page;
  private readonly emailInputField: Locator;
  private readonly passwordInputField: Locator;
  private readonly nextButton: Locator;
  private readonly mailItem: Locator;
  private readonly mailItemRow: Locator;
  private readonly reviewDocBtn: Locator;
  private readonly signInHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInputField = page.locator('input[aria-label="Email or phone"]');
    this.passwordInputField = page.locator(
      'input[aria-label="Enter your password"]',
    );
    this.nextButton = page.locator('//span[text()="Next"]');
    this.mailItem = page.locator('[email="dse_demo@docusign.net"]');
    this.mailItemRow = page.locator(
      '//span[@email="dse_demo@docusign.net"]//parent::span//parent::div//parent::td',
    );
    this.reviewDocBtn = page.locator(
      '//a[contains(@href,"https://demo.docusign.net/signing/emails/")]',
    );
    this.signInHeading = page.locator('//span[text()="Sign in"]');
  }

  async loginToGmailAndReviewDoc(): Promise<Page> {
    await this.page.waitForLoadState();
    if (await this.signInHeading.isVisible()) {
      await this.emailInputField.fill(process.env.DOCUSIGN_QA_USERNAME!);
      await this.nextButton.click();
      await this.page.waitForLoadState();
      await this.passwordInputField.fill(process.env.DOCUSIGN_QA_PASSWORD!);
      await this.nextButton.last().click();
      await this.page.waitForLoadState();
    }
    console.log(
      "Logging into Gmail and reviewing document",
      await this.mailItem.count(),
      await this.mailItem.nth(0).textContent(),
      await this.mailItem.nth(1).textContent(),
    );
    for (let i = 0; i < (await this.mailItem.count()); i++) {
      if (
        (await this.mailItem.nth(i).textContent())?.includes(
          "Shubhang CLM via Do",
        )
      ) {
        console.log(await this.mailItem.nth(i).textContent());
        await this.mailItemRow.nth(i).click({ force: true });
        break;
      }
      await this.page.waitForTimeout(1000);
    }
    await this.page.waitForLoadState();
    await this.reviewDocBtn.click();
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent("page"),
    ]);
    await newPage.waitForLoadState();
    return newPage;
  }
}
