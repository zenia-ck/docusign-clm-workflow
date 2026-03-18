import { Page, Locator } from "@playwright/test";

export class TroubleShootActivityNDAPage {
  private readonly page: Page;
  private readonly choiceOneBlock: Locator;
  private readonly emailContent: Locator;

  constructor(page: Page) {
    this.page = page;
    this.choiceOneBlock = page.locator("#v-253 > tspan");
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
}
