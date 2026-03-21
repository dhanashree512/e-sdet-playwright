// The playwright.config.ts file is essential because it is the 
// central hub for defining and managing test runner configurations 
// in a Playwright project. It allows users to control how tests 
// are collected and executed, offering options for aspects like 
// parallelism, browsers, and reporting.

import { defineConfig, devices } from '@playwright/test';
// The config file is the first thing Playwright loads before
// running any tests. So by calling dotenv.config() there, 
// all environment variables are available everywhere — 
// in the config itself and in every test file.
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './tests',
  // This is the per-test timeout in milliseconds. If a single test takes 
  // longer than 30 seconds, Playwright automatically fails it. 
  // Prevents tests from hanging forever if something goes wrong 
  // — like a page that never loads.
  timeout: 30000,
  // This is a separate, smaller timeout specifically for assertions.
  //  Playwright keeps retrying that assertion for up to 5 seconds 
  //  before failing it. This is different from the overall test timeout 
  //  — it's just for the expect() calls.
  expect: {
    timeout: 5000,
  },
  // By default Playwright runs test files in parallel but 
  // tests within the same file run sequentially. Setting 
  // this to true means every individual test runs in parallel 
  // — even within the same file. Speeds up your overall suite significantly.
  fullyParallel: true,
//   test.only is a Playwright feature that lets you run just one test 
//   while debugging locally.
//   forbidOnly: true makes Playwright throw an error if it finds any test.only
//    in the codebase. The !!process.env.CI means this guard is only active on CI, 
//    not locally where test.only is useful for debugging.
// The !! is just a JavaScript trick to convert any value to a proper 
// boolean — !!undefined becomes false, !!"true" becomes true.

  forbidOnly: !!process.env.CI,

  // Locally: 0 retries — if a test fails it fails immediately, 
  // giving you fast feedback while developing On CI: 2 retries 
  // — if a test fails Playwright runs it up to 2 more times 
  // before marking it as failed, catching transient flaky tests
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
  ],

  // this use block defines global settings that apply to every test across 
  // the entire framework.
  use: {
    baseURL: process.env.BASE_URL || 'https://www.saucedemo.com',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'ui-chromium',
      testDir: './tests/ui',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        baseURL: process.env.API_BASE_URL || 'https://jsonplaceholder.typicode.com',
      },
    },
  ],
});