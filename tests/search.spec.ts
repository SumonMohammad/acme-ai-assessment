import { test } from "../src/fixtures/base-fixture";
import { expect } from "@playwright/test";

test("Validate search functionality for valid input", async ({
  searchPage,
}) => {
  await searchPage.goToUrl();
  const { status, body } = await searchPage.performSearch("bas", 200);
  expect(status).toBe(200);
  const uiData = await searchPage.getRenderedResults();
  const apiData = searchPage.extractApiDocuments(body);
  expect(uiData).toEqual(apiData);
});

test("Validate search functionality for no results found", async ({ searchPage }) => {
  await searchPage.goToUrl();
  const { status, body } = await searchPage.performSearch("nonexistentquery", 200); 
  expect(status).toBe(200);
  const uiData = await searchPage.getRenderedResults();
  const apiData = searchPage.extractApiDocuments(body);
  expect(uiData).toEqual(apiData);
  expect(body.data.matched_docs.length).toBe(0);
  await expect(searchPage.noResultMessage).toBeVisible();
  await expect(searchPage.noResultMessage)
    .toContainText(`No documents found matching`);
});

test("User can't submit empty search query", async ({ searchPage }) => {
  await searchPage.goToUrl();
  await searchPage.searchInput.fill("");
  await expect(searchPage.searchButton).toBeDisabled();
});

test("User can bypass submit empty search query by pressing Enter", async ({ searchPage }) => {
  await searchPage.goToUrl();
  await searchPage.searchInput.fill("");
  await expect(searchPage.searchButton).toBeDisabled();
  await searchPage.searchButton.press("Enter");
});

test("Validate search functionality for special characters", async ({ searchPage }) => {
  await searchPage.goToUrl();
  const { status, body } = await searchPage.performSearch("special!@#$%^&*()", 200);
  expect(status).toBe(200);
  const uiData = await searchPage.getRenderedResults();
  const apiData = searchPage.extractApiDocuments(body);
  expect(uiData).toEqual(apiData);
});

test("Validate search functionality for long input and its breaking design", async ({ searchPage }) => {
  await searchPage.goToUrl();
  const longQuery = "a".repeat(1000); 
  const { status, body } = await searchPage.performSearch(longQuery, 200);
  expect(status).toBe(200);
  const uiData = await searchPage.getRenderedResults();
  const apiData = searchPage.extractApiDocuments(body);
  expect(uiData).toEqual(apiData);
});

test("Validate user can perform multiple searches in a row without refreshing the page", async ({ searchPage }) => {
  await searchPage.goToUrl(); 
  const queries = ["law", "bb", "legal"];
  for (const query of queries) {
    const { status, body } = await searchPage.performSearch(query, 200);
    expect(status).toBe(200);
    const uiData = await searchPage.getRenderedResults();
    const apiData = searchPage.extractApiDocuments(body);
    expect(uiData).toEqual(apiData);
  }
});

test("Validate search functionality with whitespace", async ({ searchPage }) => {
  await searchPage.goToUrl();
  const { status, body } = await searchPage.performSearch("   data protection   ", 200);
  expect(status).toBe(200);
  const uiData = await searchPage.getRenderedResults();
  const apiData = searchPage.extractApiDocuments(body);
  expect(uiData).toEqual(apiData);
});

test("Validate search functionality with case sensitivity", async ({ searchPage }) => {
  await searchPage.goToUrl();
  const { status, body } = await searchPage.performSearch("Data Protection", 200);
  expect(status).toBe(200);
  const uiData = await searchPage.getRenderedResults();
  const apiData = searchPage.extractApiDocuments(body);
  expect(uiData).toEqual(apiData);
});

test("Validate search with only whitespace input", async ({ searchPage }) => {
  await searchPage.goToUrl();
  const { status, body } = await searchPage.performSearch("     ", 200);  
  expect(status).toBe(200);
  const uiData = await searchPage.getRenderedResults();
  const apiData = searchPage.extractApiDocuments(body);
  expect(uiData).toEqual(apiData);
});
  