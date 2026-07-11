import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("should load with correct title and key content", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/Explore Your Coding Universe|GitVerse/);

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("heading", { name: /coding universe/i })).toBeVisible();
    await expect(page.getByText(/Login with GitHub/i)).toBeVisible();
    await expect(page.getByText(/View Demo Universe/i)).toBeVisible();
  });

  test("should have functional top navigation bar", async ({ page }) => {
    await page.goto("/");

    const nav = page.getByRole("navigation").first();
    await expect(nav).toBeVisible();

    await expect(nav.getByRole("link", { name: /dashboard/i })).toBeVisible();
    await expect(nav.getByRole("link", { name: /achievements/i })).toBeVisible();
    await expect(nav.getByRole("link", { name: /wrapped/i })).toBeVisible();
  });

  test("skip-to-content link should be present and functional", async ({ page }) => {
    await page.goto("/");

    const skipLink = page.getByText(/skip to content/i);
    await expect(skipLink).toBeVisible();
    await expect(skipLink).toHaveAttribute("href", "#main-content");
  });

  test("should have dark theme background", async ({ page }) => {
    await page.goto("/");

    const body = page.locator("body");
    const bg = await body.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    const rgb = bg.match(/\d+/g)?.map(Number);
    expect(rgb).toBeDefined();
    if (rgb) {
      expect(rgb[0]).toBeLessThan(50);
      expect(rgb[1]).toBeLessThan(50);
      expect(rgb[2]).toBeLessThan(50);
    }
  });

  test("should have accessible landmark regions", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("#main-content")).toBeVisible();
    const navigations = page.getByRole("navigation");
    const count = await navigations.count();
    expect(count).toBeGreaterThan(0);
  });
});
