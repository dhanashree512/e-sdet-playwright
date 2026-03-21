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

  authenticatedPage: async ({ browser }, use) => {
    const storageStatePath = 'auth.json';

    if (!fs.existsSync(storageStatePath)) {
      const context = await browser.newContext();
      const page = await context.newPage();

      await page.goto('https://www.saucedemo.com');
      await page.locator('[data-test="username"]').fill(USERS.standard.username);
      await page.locator('[data-test="password"]').fill(USERS.standard.password);
      await page.locator('[data-test="login-button"]').click();
      await page.waitForURL(/inventory/);

      await context.storageState({ path: storageStatePath });
      await context.close();
    }

    const context = await browser.newContext({
      storageState: storageStatePath,
    });
    const page = await context.newPage();

    await use(page);

    await context.close();
  },

  // ── API client fixture ───────────────────────────────────────────────

  apiClient: async ({ playwright }, use) => {
    const client = await playwright.request.newContext({
      baseURL: process.env.API_BASE_URL || 'https://jsonplaceholder.typicode.com',
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    await use(client);

    await client.dispose();
  },

  // ── Test data fixture ────────────────────────────────────────────────

  testUser: async ({}, use) => {
    const user = {
      username: `test_user_${Date.now()}`,
      password: 'secret_sauce',
    };

    await use(user);

    console.log(`[teardown] test user ${user.username} would be deleted here`);
  },

});

export { expect };