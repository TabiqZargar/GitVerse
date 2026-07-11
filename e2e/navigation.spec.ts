import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("should navigate to dashboard page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /dashboard/i }).first().click();
    await page.waitForURL("/dashboard");
    await expect(page.getByRole("main")).toBeVisible();
  });

  test("should navigate to repositories page", async ({ page }) => {
    await page.goto("/dashboard");
    await page.getByRole("link", { name: /repositories/i }).first().click();
    await page.waitForURL("/dashboard/repos");
    await expect(page.getByRole("main")).toBeVisible();
  });

  test("should navigate to analytics page", async ({ page }) => {
    await page.goto("/dashboard");
    await page.getByRole("link", { name: /analytics/i }).first().click();
    await page.waitForURL("/dashboard/analytics");
    await expect(page.getByRole("main")).toBeVisible();
  });

  test("should navigate to visualization page", async ({ page }) => {
    await page.goto("/dashboard");
    await page.getByRole("link", { name: /visualization/i }).first().click();
    await page.waitForURL("/dashboard/visualization");
    await expect(page.getByRole("main")).toBeVisible();
  });

  test("login page should be accessible", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: /welcome to gitverse/i })).toBeVisible();
    await expect(page.getByText(/sign in with your github account/i)).toBeVisible();
  });

  test.describe("Mobile navigation", () => {
    test.use({ viewport: { width: 375, height: 812 } });

    test("should open and close mobile menu", async ({ page }) => {
      await page.goto("/");

      const menuButton = page.getByRole("button", { name: /open menu/i });
      await expect(menuButton).toBeVisible();
      await expect(menuButton).toHaveAttribute("aria-expanded", "false");

      await menuButton.click();

      const closeButton = page.getByRole("button", { name: /close menu/i });
      await expect(closeButton).toBeVisible();
      await expect(closeButton).toHaveAttribute("aria-expanded", "true");

      const mobileNav = page.getByRole("navigation", { name: /mobile navigation/i });
      await expect(mobileNav).toBeVisible();
      await expect(mobileNav.getByRole("link", { name: /dashboard/i })).toBeVisible();
      await expect(mobileNav.getByRole("link", { name: /repositories/i })).toBeVisible();

      await closeButton.click();
      await expect(mobileNav).not.toBeVisible();
    });
  });
});
