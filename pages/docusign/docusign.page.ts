import { Page, Locator } from "@playwright/test";

export class DocuSignPage {
  private readonly page: Page;
  private readonly closePopup: Locator;
  private readonly startBtn: Locator;
  private readonly signBtn: Locator;
  private readonly finishBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.closePopup = page.locator('[aria-label="Close"]');
    this.startBtn = page.locator('[data-qa="auto-nav-caret"]');
    this.signBtn = page.locator(
      '[class="signature-tab-content  tab-button-cobalt v2"]',
    );
    this.finishBtn = page.locator('[data-qa="slide-up-bar-finish-button"]');
  }

  async signTheDocument(): Promise<void> {
    await this.page.waitForLoadState();
    if (await this.closePopup.isVisible()) {
      await this.closePopup.click();
    }
    await this.startBtn.click();
    await this.signBtn.click();
    await this.finishBtn.click();
    await this.page.waitForLoadState();
    await this.page.waitForTimeout(5000);
  }
}
