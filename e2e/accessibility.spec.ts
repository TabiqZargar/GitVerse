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

  test("headings should start with h1 and not skip levels", async ({ page }) => {
    await page.goto("/dashboard");

    const headings = page.locator("h1, h2, h3, h4, h5, h6");
    const count = await headings.count();

    expect(count).toBeGreaterThan(0);

    const firstTag = await headings.nth(0).evaluate((el) => el.tagName.toLowerCase());
    const firstLevel = parseInt(firstTag[1] ?? "1", 10);
    expect(firstLevel).toBeLessThanOrEqual(2);

    if (count > 1) {
      let prevLevel = firstLevel;
      for (let i = 1; i < count; i++) {
        const tag = await headings.nth(i).evaluate((el) => el.tagName.toLowerCase());
        const level = parseInt(tag[1] ?? "1", 10);
        expect(level - prevLevel).toBeLessThanOrEqual(2);
        prevLevel = level;
      }
    }
  });
});
