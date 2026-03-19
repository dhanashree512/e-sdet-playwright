import { test, expect } from '../fixtures/baseFixture';

test.describe('Sauce Demo Login Page', () => {
  test.beforeEach(async ({ page, loginPage }) => {
    await loginPage.goto();
  });

  test.describe('Valid Login Scenarios', () => {
    test('should login successfully with valid standard user credentials', async ({ page, loginPage }) => {
      await loginPage.login('standard_user', 'secret_sauce');
      await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    });
  });

  test.describe('Invalid Login Scenarios', () => {
    test('should display error message when locked out user tries to login', async ({ page, loginPage }) => {
      await loginPage.login('locked_out_user', 'secret_sauce');
      const errorMessage = await loginPage.getErrorMessage();
      await expect(errorMessage).toContain('Sorry, this user has been locked out');
      await expect(page).toHaveURL('https://www.saucedemo.com/');
    });

    test('should display error message with invalid username', async ({ page, loginPage }) => {
      await loginPage.login('invalid_user', 'secret_sauce');
      const errorMessage = await loginPage.getErrorMessage();
      await expect(errorMessage).toContain('Username and password do not match any user in this service');
      await expect(page).toHaveURL('https://www.saucedemo.com/');
    });

    test('should display error message with invalid password', async ({ page, loginPage }) => {
      await loginPage.login('standard_user', 'invalid_password');
      const errorMessage = await loginPage.getErrorMessage();
      await expect(errorMessage).toContain('Username and password do not match any user in this service');
      await expect(page).toHaveURL('https://www.saucedemo.com/');
    });

    test('should display error message with both invalid credentials', async ({ page, loginPage }) => {
      await loginPage.login('invalid_user', 'invalid_password');
      const errorMessage = await loginPage.getErrorMessage();
      await expect(errorMessage).toContain('Username and password do not match any user in this service');
      await expect(page).toHaveURL('https://www.saucedemo.com/');
    });
  });

  test.describe('Empty Field Scenarios', () => {
    test('should display error message when username is empty', async ({ page, loginPage }) => {
      await loginPage.login('', 'secret_sauce');
      const errorMessage = await loginPage.getErrorMessage();
      await expect(errorMessage).toContain('Username is required');
      await expect(page).toHaveURL('https://www.saucedemo.com/');
    });

    test('should display error message when password is empty', async ({ page, loginPage }) => {
      await loginPage.login('standard_user', '');
      const errorMessage = await loginPage.getErrorMessage();
      await expect(errorMessage).toContain('Password is required');
      await expect(page).toHaveURL('https://www.saucedemo.com/');
    });

    test('should display error message when both username and password are empty', async ({ page, loginPage }) => {
      await loginPage.login('', '');
      const errorMessage = await loginPage.getErrorMessage();
      await expect(errorMessage).toContain('Username is required');
      await expect(page).toHaveURL('https://www.saucedemo.com/');
    });
  });

  test.describe('Edge Case Scenarios', () => {
    test('should handle whitespace-only username', async ({ page, loginPage }) => {
      await loginPage.login('   ', 'secret_sauce');
      const errorMessage = await loginPage.getErrorMessage();
      await expect(errorMessage).toContain('Username and password do not match any user in this service');
      await expect(page).toHaveURL('https://www.saucedemo.com/');
    });

    test('should handle whitespace-only password', async ({ page, loginPage }) => {
      await loginPage.login('standard_user', '   ');
      const errorMessage = await loginPage.getErrorMessage();
      await expect(errorMessage).toContain('Username and password do not match any user in this service');
      await expect(page).toHaveURL('https://www.saucedemo.com/');
    });

    test('should handle case sensitive username', async ({ page, loginPage }) => {
      await loginPage.login('Standard_User', 'secret_sauce');
      const errorMessage = await loginPage.getErrorMessage();
      await expect(errorMessage).toContain('Username and password do not match any user in this service');
      await expect(page).toHaveURL('https://www.saucedemo.com/');
    });

    test('should handle case sensitive password', async ({ page, loginPage }) => {
      await loginPage.login('standard_user', 'Secret_Sauce');
      const errorMessage = await loginPage.getErrorMessage();
      await expect(errorMessage).toContain('Username and password do not match any user in this service');
      await expect(page).toHaveURL('https://www.saucedemo.com/');
    });

    test('should handle special characters in username', async ({ page, loginPage }) => {
      await loginPage.login('user@#$%', 'secret_sauce');
      const errorMessage = await loginPage.getErrorMessage();
      await expect(errorMessage).toContain('Username and password do not match any user in this service');
      await expect(page).toHaveURL('https://www.saucedemo.com/');
    });

    test('should handle special characters in password', async ({ page, loginPage }) => {
      await loginPage.login('standard_user', 'pass@#$%');
      const errorMessage = await loginPage.getErrorMessage();
      await expect(errorMessage).toContain('Username and password do not match any user in this service');
      await expect(page).toHaveURL('https://www.saucedemo.com/');
    });

    test('should handle very long username', async ({ page, loginPage }) => {
      const longUsername = 'a'.repeat(100);
      await loginPage.login(longUsername, 'secret_sauce');
      const errorMessage = await loginPage.getErrorMessage();
      await expect(errorMessage).toContain('Username and password do not match any user in this service');
      await expect(page).toHaveURL('https://www.saucedemo.com/');
    });

    test('should handle very long password', async ({ page, loginPage }) => {
      const longPassword = 'a'.repeat(100);
      await loginPage.login('standard_user', longPassword);
      const errorMessage = await loginPage.getErrorMessage();
      await expect(errorMessage).toContain('Username and password do not match any user in this service');
      await expect(page).toHaveURL('https://www.saucedemo.com/');
    });
  });

  test.describe('UI Element Verification', () => {
    test('should verify all login form elements are visible', async ({ page }) => {
      await expect(page.locator('[data-test="username"]')).toBeVisible();
      await expect(page.locator('[data-test="password"]')).toBeVisible();
      await expect(page.locator('[data-test="login-button"]')).toBeVisible();
    });

    test('should verify login form elements have correct attributes', async ({ page }) => {
      await expect(page.locator('[data-test="username"]')).toHaveAttribute('type', 'text');
      await expect(page.locator('[data-test="password"]')).toHaveAttribute('type', 'password');
      await expect(page.locator('[data-test="login-button"]')).toHaveAttribute('type', 'submit');
    });

    test('should verify error message container is not visible initially', async ({ page }) => {
      await expect(page.locator('[data-test="error"]')).not.toBeVisible();