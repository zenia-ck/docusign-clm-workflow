import { Page, Locator, expect } from "@playwright/test";

export class TroubleShootActivityNDAPage {
  private readonly page: Page;
  private readonly choiceOneBlock: Locator;
  private readonly routingBlock: Locator;
  private readonly emailContent: Locator;
  private readonly sentForSignatureBlock: Locator;
  private readonly actionInitiatedText: Locator;

  constructor(page: Page) {
    this.page = page;
    this.choiceOneBlock = page.locator("#v-253 > tspan");
    this.routingBlock = page.locator("#v-409 > tspan");
    this.sentForSignatureBlock = page.locator("#v-276 > tspan");
    this.actionInitiatedText = page.locator('[ng-bind-html="description"]');
    this.emailContent = page.locator(
      '//div[@ng-bind-html="description"][contains(text(),"Assigning")]',
    );
  }

  async getTheAssignedEmail(): Promise<string | null> {
    await this.choiceOneBlock.dblclick();
    const text = await this.emailContent.textContent();
    const email = text?.match(/[\w.-]+@[\w.-]+\.\w+/)?.[0] || null;
    return email;
  }

  async getTheAssignedEmailForRouting(): Promise<string | null> {
    await this.routingBlock.dblclick();
    const text = await this.emailContent.textContent();
    const email = text?.match(/[\w.-]+@[\w.-]+\.\w+/)?.[0] || null;
    return email;
  }

  async verifyTheStatusAsSentForSignature(): Promise<void> {
    await this.sentForSignatureBlock.first().dblclick();
    await expect(this.actionInitiatedText.first()).toHaveText(
      "Action initiated.",
    );
    await expect(this.actionInitiatedText.nth(2)).toHaveText(
      "Waiting for signature response.",
    );
  }
}
