import { test, expect } from "@playwright/test";

test.describe("Accessibility", () => {
  test("skip-to-content link should move focus to main on activation", async ({ page }) => {
    await page.goto("/dashboard");

    await page.keyboard.press("Tab");
    const skipLink = page.getByText(/skip to content/i);
    await expect(skipLink).toBeFocused();

    await skipLink.click();
    await expect(page.locator("#main-content")).toBeFocused();
  });

  test("all images should have alt text or be decorative", async ({ page }) => {
    await page.goto("/");

    const images = page.locator("img");
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute("alt");
      const ariaHidden = await img.getAttribute("aria-hidden");
      expect(alt !== null || ariaHidden === "true").toBeTruthy();
    }
  });

  test("interactive elements should have accessible labels", async ({ page }) => {
    await page.goto("/dashboard/analytics");

    const buttons = page.locator("button");
    const count = await buttons.count();

    for (let i = 0; i < count; i++) {
      const btn = buttons.nth(i);
      const hasAriaLabel = await btn.getAttribute("aria-label");
      const hasText = await btn.textContent();
      const hasAriaLabeledBy = await btn.getAttribute("aria-labelledby");
      expect(
        hasAriaLabel !== null ||
        (hasText !== null && hasText.trim().length > 0) ||
        hasAriaLabeledBy !== null
      ).toBeTruthy();
    }
  });

  test("headings should be in semantic order", async ({ page }) => {
    await page.goto("/dashboard");

    const headings = page.locator("h1, h2, h3, h4, h5, h6");
    const count = await headings.count();

    let prevLevel = 0;
    for (let i = 0; i < count; i++) {
      const tag = await headings.nth(i).evaluate((el) => el.tagName.toLowerCase());
      const level = parseInt(tag[1] ?? "1", 10);
      expect(level - prevLevel).toBeLessThanOrEqual(1);
      prevLevel = level;
    }
  });

  test("navigation has aria-current for active page", async ({ page }) => {
    await page.goto("/dashboard/repos");

    const activeLink = page.getByRole("link", { name: /repositories/i }).first();
    await expect(activeLink).toHaveAttribute("aria-current", /page|true/);
  });
});
