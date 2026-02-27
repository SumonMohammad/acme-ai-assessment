import { Locator, Page } from "@playwright/test";

export interface DocumentData {
  title: string;
  content: string;
}

export class SearchPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly searchButton: Locator;
  readonly searchInput: Locator;
  readonly searchSummary: Locator;
  readonly searchContent: Locator;
  readonly loadingText: Locator;
  readonly noResultMessage: Locator;
  readonly resultCards: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.getByRole("heading", { name: "Legal Assistant" });
    this.searchButton = page.getByRole("button", { name: "Search" });
    this.searchInput = page.getByRole("searchbox", {
      name: "Search for legal documents...",
    });
    this.resultCards = page.locator(".bg-white.p-6.rounded-lg.border");
    this.searchSummary = page.getByRole("heading", { name: "Summary" });
    this.searchContent = page.getByTestId("search-content");
    this.loadingText = page.getByText("Searching legal documents...");
    this.noResultMessage = page.getByText("No documents found", { exact: false });
  }

  async goToUrl(): Promise<void> {
    await this.page.goto("/");
    await this.page.waitForLoadState("networkidle");
  }

  async performSearch(query: string, expectedStatus: number = 200) {
    await this.searchInput.fill(query);

    const [response] = await Promise.all([
      this.page.waitForResponse(
        (res) =>
          res.url().includes("/generate") &&
          res.status() === expectedStatus
      ),
      this.searchButton.click(),
    ]);

    const body = await response.json().catch(() => null);

    return {
      status: response.status(),
      body,
    };
  }

  async getRenderedResults(): Promise<DocumentData[]> {
    const count = await this.resultCards.count();
    const data: DocumentData[] = [];

    for (let i = 0; i < count; i++) {
      const card = this.resultCards.nth(i);

      data.push({
        title: (await card.locator("h3").innerText()).trim(),
        content: (await card.locator("p").innerText()).trim(),
      });
    }

    return data;
  }
  extractApiDocuments(body: any): DocumentData[] {
    if (!body?.data?.matched_docs) return [];

    return body.data.matched_docs.map((doc: any) => ({
      title: doc.title,
      content: doc.content,
    }));
  }
}
