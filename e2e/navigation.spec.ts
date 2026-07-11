import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("should navigate to wrapped page via top nav", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: /wrapped/i }).first().click();
    await page.waitForURL("/wrapped");
    await expect(page.locator("#main-content")).toBeVisible();
  });

  test("should navigate to dashboard page via URL", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.locator("#main-content")).toBeVisible();
  });

  test("should navigate to wrapped page via URL", async ({ page }) => {
    await page.goto("/wrapped");
    await expect(page.locator("#main-content")).toBeVisible();
  });

  test("login page should be accessible", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: /welcome to gitverse/i })).toBeVisible();
    await expect(page.getByText(/sign in with your github account/i)).toBeVisible();
  });

  test.describe("Mobile navigation", () => {
    test.use({ viewport: { width: 375, height: 812 } });

    test("should navigate via direct URL on mobile", async ({ page }) => {
      await page.goto("/dashboard");
      await expect(page.locator("#main-content")).toBeVisible();
    });
  });
});
