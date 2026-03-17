import { Page, Locator, expect } from "@playwright/test";

export class WorkflowPage {
  private readonly page: Page;
  private readonly workflowBtn: Locator;
  private readonly filterDate: Locator;
  private readonly filterOption: Locator;
  private readonly applyBtn: Locator;
  private readonly workflowName: Locator;

  constructor(page: Page) {
    this.page = page;
    this.workflowBtn = page.locator('//span[text()="Workflows"]');
    this.filterDate = page.locator('[title="Today"]');
    this.filterOption = page.locator('//li[text()="Last 7 Days"]');
    this.applyBtn = page.locator('//button[text()="Apply"]');
    this.workflowName = page.locator('[title="Troubleshooting Activity_NDA"]');
  }

  async checkLastStep() {
    await this.page.waitForLoadState();
    await this.workflowBtn.click();
    await this.filterDate.click();
    await this.filterOption.click();
    await this.applyBtn.click();
    await this.workflowName.first().click();
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent("page"),
    ]);
    await newPage.waitForLoadState();
    await newPage.waitForTimeout(3000);
    expect(newPage.getByText("Troubleshooting Activity_NDA")).toBeVisible();
    const switchViewButton = newPage.locator('[icon="switch-view"]');
    await switchViewButton.last().click();
    await newPage.waitForTimeout(3000);
    const lastStep = newPage.locator("#v-919 > tspan");
    const lastStepValue = newPage.locator("#v-916 > tspan");
    const lastStepText = (await lastStep.textContent())
      ?.replace(/\u00A0/g, " ")
      .trim();
    const lastStepValueText = (await lastStepValue.textContent())
      ?.replace(/\u00A0/g, " ")
      .trim();
    console.log("Last Step Text:", lastStepText);
    console.log("Last Step Value Text:", lastStepValueText);
    expect(lastStepText).toContain("Legal Review");
    expect(lastStepValueText).toContain("Choice 1");
  }
}
