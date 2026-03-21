import { test as base, expect, APIRequestContext, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { USERS } from '../utils/testData';
import * as fs from 'fs';

type PageFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  authenticatedPage: Page;
  apiClient: APIRequestContext;
  testUser: { username: string; password: string };
};

export const test = base.extend<PageFixtures>({

  // ── Basic page object fixtures ──────────────────────────────────────

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  // ── Storage state fixture (faster login) ────────────────────────────
  // Logs in once via UI, saves browser state to auth.json,
  // reuses that state for every test — skips UI login entirely

  authenticatedPage: [async ({ browser }, use) => {
    const storageStatePath = 'auth.json';

    // only login if auth.json doesn't exist yet
    if (!fs.existsSync(storageStatePath)) {
      const context = await browser.newContext();
      const page = await context.newPage();

      await page.goto('/');
      await page.locator('[data-test="username"]').fill(USERS.standard.username);
      await page.locator('[data-test="password"]').fill(USERS.standard.password);
      await page.locator('[data-test="login-button"]').click();
      await page.waitForURL(/inventory/);

      await context.storageState({ path: storageStatePath });
      await context.close();
    }

    // create a new context using the saved auth state
    const context = await browser.newContext({
      storageState: storageStatePath,
    });
    const page = await context.newPage();

    await use(page);

    // teardown — close context after test
    await context.close();

  }, { scope: 'worker' }],  // ← worker scoped — shared across all tests

  // ── API client fixture ───────────────────────────────────────────────
  // Pre-configured request context with base URL and headers
  // Disposed automatically after each test

  apiClient: async ({ playwright }, use) => {
    const client = await playwright.request.newContext({
      baseURL: process.env.API_BASE_URL || 'https://jsonplaceholder.typicode.com',
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    await use(client);

    // teardown — dispose client after test
    await client.dispose();
  },

  // ── Test data fixture ────────────────────────────────────────────────
  // Generates a unique test user per test run
  // In a real app this would create and then delete the user via API

  testUser: async ({}, use) => {
    const user = {
      username: `test_user_${Date.now()}`,
      password: 'secret_sauce',
    };

    await use(user);

    // teardown — in a real app: await deleteUserViaAPI(user.username)
    console.log(`[teardown] test user ${user.username} would be deleted here`);
  },

});

export { expect };