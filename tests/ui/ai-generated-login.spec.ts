import { test, expect } from '../../fixtures/baseFixture';
import { USERS, MESSAGES } from '../../utils/testData';

test.describe('AI Generated - Login Page', () => {

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test.describe('Valid Login Scenarios', () => {

    test('should login successfully with standard user', async ({ loginPage, page }) => {
      await loginPage.login(USERS.standard.username, USERS.standard.password);
      await expect(page).toHaveURL(/inventory/);
    });

  });

  test.describe('Invalid Login Scenarios', () => {

    test('should show error for locked out user', async ({ loginPage }) => {
      await loginPage.login(USERS.locked.username, USERS.locked.password);
      const error = await loginPage.getErrorMessage();
      expect(error).toContain(MESSAGES.lockedError);
    });

    test('should show error for invalid credentials', async ({ loginPage }) => {
      await loginPage.login('invalid_user', 'wrong_password');
      const error = await loginPage.getErrorMessage();
      expect(error).toContain('Username and password do not match');
    });

    test('should show error when username is empty', async ({ loginPage }) => {
      await loginPage.login('', USERS.standard.password);
      const error = await loginPage.getErrorMessage();
      expect(error).toContain('Username is required');
    });

    test('should show error when password is empty', async ({ loginPage }) => {
      await loginPage.login(USERS.standard.username, '');
      const error = await loginPage.getErrorMessage();
      expect(error).toContain('Password is required');
    });

  });

  test.describe('UI Element Verification', () => {

    test('should verify all login form elements are visible', async ({ page }) => {
      await expect(page.locator(`[data-test="username"]`)).toBeVisible();
      await expect(page.locator(`[data-test="password"]`)).toBeVisible();
      await expect(page.locator(`[data-test="login-button"]`)).toBeVisible();
    });

    test('should verify login button has correct type attribute', async ({ page }) => {
      await expect(page.locator(`[data-test="login-button"]`)).toHaveAttribute('type', 'submit');
    });

    test('should verify error message is not visible initially', async ({ page }) => {
      await expect(page.locator(`[data-test="error"]`)).not.toBeVisible();
    });

  });

});
