// Playwright fixtures are used to establish a precise and isolated environment 
// for each test, providing necessary resources and setup logic while ensuring 
// cleanup occurs automatically. They promote code reusability, maintainability, 
// and scalability in test automation frameworks.

// Every time a test requests loginPage, inventoryPage, or cartPage.
// Playwright automatically runs the corresponding fixture function, 
// creates a fresh page object instance, and injects it into the test. 
// The test never has to worry about instantiation or setup. 
// That's dependency injection in action. 

import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';

type PageFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
};

// Playwright starts test
//        ↓
// Sees test needs "loginPage"
//        ↓
// Calls loginPage fixture function
//        ↓
// Creates new LoginPage(page)
//        ↓
// Calls use(loginPage) ← hands it to the test
//        ↓
// Test runs with loginPage available
//        ↓
// Test finishes
//        ↓
// Anything after use() runs here (teardown)
export const test = base.extend<PageFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
});

export { expect } from '@playwright/test';

// Fixtures in Playwright go far beyond just injecting page objects. 
// You can handle authentication, manage test data lifecycle, 
// configure API clients, and control scope — all in one place. 
// It's the backbone of a scalable framework.

// The big picture
// Fixture type              What it does 
// Page object fixture      Injects POMs into tests
// Auto-login fixture       Handles auth before every test
// Storage state fixture    Skips UI login for speed
// API client fixture       Pre-configured request context
// Test data fixture        Creates and cleans up data
// Worker scoped fixture    Shared expensive setup