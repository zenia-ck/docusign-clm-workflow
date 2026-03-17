import { Locator, Page } from "@playwright/test";

export class TroubleshootNDAPage {
  private readonly page: Page;
  private readonly customerNameField: Locator;
  private readonly customerEmailField: Locator;
  private readonly ndaPurposeSelectBox: Locator;
  private readonly departmentSelectBox: Locator;
  private readonly nextButton: Locator;
  private readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.customerNameField = page.locator('[_name="Customer_Name"]');
    this.customerEmailField = page.locator('[_name="Customer_Signer_Email"]');
    this.ndaPurposeSelectBox = page.locator('[_name="NDA_Purpose"]');
    this.departmentSelectBox = page.locator('[_name="Department_Impacted"]');
    this.nextButton = page.locator('//button[text()="Next"]');
    this.saveButton = page.locator('[title="Save"]');
  }

  async fillNDAForm(parentPage: Page, userName: string): Promise<Page> {
    await this.customerNameField.fill(userName);
    await this.customerEmailField.fill(process.env.DOCUSIGN_QA_USERNAME!);
    await this.ndaPurposeSelectBox.selectOption(
      "to evaluate the party interest in developing research collaborations",
    );
    await this.departmentSelectBox.selectOption("Finance");
    await this.nextButton.click();
    await this.page.waitForLoadState();
    await this.saveButton.last().click();
    await this.page.waitForLoadState();
    await this.page.waitForEvent("close");
    return parentPage;
  }
}
